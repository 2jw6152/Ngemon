import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { BattleLogEntry, BattleSide, MajorStatus } from '../../battle/types';
import { useGameStore } from '../../state/store';
import { BattleStage } from '../components/BattleStage';
import { BattleHUD } from '../components/BattleHUD';
import { BattleLog } from '../components/BattleLog';
import { ActionBar } from '../components/ActionBar';

export const BattlePage: React.FC = () => {
  const STEP_INTERVAL_MS = 2000;
  const LOG_TO_ATTACK_DELAY_MS = 1000;
  const ATTACK_TO_DAMAGE_DELAY_MS = 1000;
  const DAMAGE_TO_FAINT_DELAY_MS = 1000;

  const [introStep, setIntroStep] = useState<'idle' | 'start' | 'player-sendout' | 'opponent-sendout' | 'done'>('idle');
  const [introLog, setIntroLog] = useState<BattleLogEntry | null>(null);
  const [latestLog, setLatestLog] = useState<BattleLogEntry | null>(null);
  const [lastSurrenderAlertSessionId, setLastSurrenderAlertSessionId] = useState<string | null>(null);
  const [currentAnimation, setCurrentAnimation] = useState<{ type: 'attack' | 'hit' | 'faint'; side: 'player' | 'opponent' } | null>(null);
  const [displayedHp, setDisplayedHp] = useState<Partial<Record<BattleSide, number>>>({});
  const [displayedStatus, setDisplayedStatus] = useState<Partial<Record<BattleSide, MajorStatus | null>>>({});
  const isProcessingResolutionRef = useRef(false);
  const lastLogSessionIdRef = useRef<string | null>(null);
  const animationResolveRef = useRef<(() => void) | null>(null);
  const animationFallbackTimerRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const activeBattle = useGameStore((state) => state.activeBattle);
  const completedBattle = useGameStore((state) => state.completedBattle);
  const pendingSwitch = useGameStore((state) => state.pendingSwitch);
  const cancelPendingSwitch = useGameStore((state) => state.cancelPendingSwitch);
  const submitCommand = useGameStore((state) => state.submitBattleCommand);
  const party = useGameStore((state) => state.party);
  const startCpuBattle = useGameStore((state) => state.startCpuBattle);
  const acknowledgeBattleResult = useGameStore((state) => state.acknowledgeBattleResult);
  const finalizeBattleResult = useGameStore((state) => state.finalizeBattleResult);
  const clearBattleEvents = useGameStore((state) => state.clearBattleEvents);
  const points = useGameStore((state) => state.points);

  const currentSession = activeBattle ?? completedBattle?.session ?? null;
  const resultOverlay = !activeBattle && completedBattle ? completedBattle : null;
  const isReady = party.length > 0;
  const introInProgress = !!activeBattle && introStep !== 'done';
  const activeBattleId = activeBattle?.id ?? null;
  const completedSessionId = completedBattle?.session.id ?? null;
  const hasPendingStepEvents = (activeBattle?.snapshot.events.length ?? 0) > 0;

  const sleep = useCallback((ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms)), []);
  const isStatusInflictLog = useCallback((message: string) => {
    return (
      message.includes('몸에 독이 퍼졌다!') ||
      message.includes('화상을 입었다!') ||
      message.includes('마비되어 기술이 나오기 어려워졌다!') ||
      message.includes('잠들어 버렸다!') ||
      message.includes('얼어붙었다!')
    );
  }, []);
  const waitForNextPaint = useCallback(
    () =>
      new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      }),
    [],
  );

  const clearAnimationWaiter = useCallback(() => {
    if (animationFallbackTimerRef.current !== null) {
      window.clearTimeout(animationFallbackTimerRef.current);
      animationFallbackTimerRef.current = null;
    }
    if (animationResolveRef.current) {
      const resolve = animationResolveRef.current;
      animationResolveRef.current = null;
      resolve();
    }
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (animationResolveRef.current) {
      const resolve = animationResolveRef.current;
      animationResolveRef.current = null;
      if (animationFallbackTimerRef.current !== null) {
        window.clearTimeout(animationFallbackTimerRef.current);
        animationFallbackTimerRef.current = null;
      }
      resolve();
    }
  }, []);

  const playAnimationAndWait = useCallback(
    async (animation: { type: 'attack' | 'hit' | 'faint'; side: 'player' | 'opponent' }) => {
      await new Promise<void>((resolve) => {
        animationResolveRef.current = resolve;
        setCurrentAnimation(animation);
        const fallbackMs = animation.type === 'faint' ? 1200 : 600;
        animationFallbackTimerRef.current = window.setTimeout(() => {
          if (animationResolveRef.current) {
            const pendingResolve = animationResolveRef.current;
            animationResolveRef.current = null;
            pendingResolve();
          }
          animationFallbackTimerRef.current = null;
        }, fallbackMs);
      });
      setCurrentAnimation(null);
    },
    [],
  );

  useEffect(() => {
    if (!activeBattleId) {
      isProcessingResolutionRef.current = false;
      clearAnimationWaiter();
      setIntroStep('idle');
      setIntroLog(null);
      lastLogSessionIdRef.current = null;
      setLatestLog(null);
      setCurrentAnimation(null);
      return;
    }

    const liveBattle = useGameStore.getState().activeBattle;
    const playerName = liveBattle?.snapshot.active.player.koName ?? '내 포켓몬';
    const opponentName = liveBattle?.snapshot.active.opponent.koName ?? '상대 포켓몬';
    let cancelled = false;
    let playerTimer: number | null = null;
    let opponentTimer: number | null = null;

    const makeLog = (message: string): BattleLogEntry => ({
      id: crypto.randomUUID(),
      side: 'system',
      message,
      timestamp: Date.now(),
    });

    setIntroStep('start');
    setIntroLog(makeLog('배틀이 시작됐다!'));

    const startTimer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }
      setIntroStep('player-sendout');
      setIntroLog(makeLog(`플레이어는 ${playerName}을(를) 내보냈다!`));

      playerTimer = window.setTimeout(() => {
        if (cancelled) {
          return;
        }
        setIntroStep('opponent-sendout');
        setIntroLog(makeLog(`상대는 ${opponentName}을(를) 내보냈다!`));

        opponentTimer = window.setTimeout(() => {
          if (cancelled) {
            return;
          }
          setIntroStep('done');
          setIntroLog(null);
        }, STEP_INTERVAL_MS);
      }, STEP_INTERVAL_MS);
    }, STEP_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      if (playerTimer !== null) {
        window.clearTimeout(playerTimer);
      }
      if (opponentTimer !== null) {
        window.clearTimeout(opponentTimer);
      }
    };
  }, [activeBattleId, STEP_INTERVAL_MS, clearAnimationWaiter]);

  useEffect(() => {
    if (!currentSession) {
      setLatestLog(null);
      lastLogSessionIdRef.current = null;
      setCurrentAnimation(null);
      setDisplayedHp({});
      setDisplayedStatus({});
      return;
    }

    if (lastLogSessionIdRef.current !== currentSession.id) {
      lastLogSessionIdRef.current = currentSession.id;
      isProcessingResolutionRef.current = false;
      clearAnimationWaiter();
      setLatestLog(null);
      setCurrentAnimation(null);
      setDisplayedHp({
        player: currentSession.snapshot.active.player.currentHp,
        opponent: currentSession.snapshot.active.opponent.currentHp,
      });
      setDisplayedStatus({
        player: currentSession.snapshot.active.player.status?.type ?? null,
        opponent: currentSession.snapshot.active.opponent.status?.type ?? null,
      });
    }
  }, [currentSession, clearAnimationWaiter]);

  useEffect(() => {
    // While unresolved step events exist, keep display HP under playback control.
    if (!currentSession || hasPendingStepEvents) {
      return;
    }
    setDisplayedHp({
      player: currentSession.snapshot.active.player.currentHp,
      opponent: currentSession.snapshot.active.opponent.currentHp,
    });
    setDisplayedStatus({
      player: currentSession.snapshot.active.player.status?.type ?? null,
      opponent: currentSession.snapshot.active.opponent.status?.type ?? null,
    });
  }, [currentSession, hasPendingStepEvents]);

  useEffect(() => {
    if (!activeBattleId || introInProgress || !hasPendingStepEvents || isProcessingResolutionRef.current) {
      return;
    }

    let cancelled = false;
    isProcessingResolutionRef.current = true;

    const processCurrentStep = async (session: NonNullable<typeof activeBattle>) => {
      if (!session || session.id !== activeBattleId) {
        return;
      }
      const stepEvents = session.snapshot.events;
      if (stepEvents.length === 0) {
        return;
      }
      let pendingAttackSide: 'player' | 'opponent' | null = null;
      const pendingDamages: Array<{ side: 'player' | 'opponent'; amount: number }> = [];
      const pendingFaints: Array<'player' | 'opponent'> = [];
      const pendingStatuses: Array<{ side: 'player' | 'opponent'; status: MajorStatus | null }> = [];
      let damageAppliedSinceLastFaint = false;
      const flushFaintVisual = async (side: 'player' | 'opponent') => {
        setDisplayedHp((prev) => ({
          ...prev,
          [side]: 0,
        }));
        await waitForNextPaint();
        await sleep(DAMAGE_TO_FAINT_DELAY_MS);
        await Promise.all([playAnimationAndWait({ type: 'faint', side }), sleep(STEP_INTERVAL_MS)]);
      };
      const applyDamageVisual = async (side: 'player' | 'opponent', amount: number) => {
        setDisplayedHp((prev) => {
          const fallbackCurrentHp = session.snapshot.active[side].currentHp;
          const currentHp = prev[side] ?? fallbackCurrentHp;
          return {
            ...prev,
            [side]: Math.max(0, currentHp - amount),
          };
        });
        // HP bar update is state-driven; wait at least one paint before faint/hit continuation.
        await waitForNextPaint();
        await playAnimationAndWait({ type: 'hit', side });
      };

      for (const event of stepEvents) {
        if (cancelled) {
          return;
        }
        if (event.kind === 'move') {
          pendingAttackSide = event.side;
          continue;
        }
        if (event.kind === 'damage') {
          pendingDamages.push({ side: event.targetSide, amount: event.amount });
          continue;
        }
        if (event.kind === 'switch') {
          setDisplayedHp((prev) => ({
            ...prev,
            [event.side]: session.snapshot.active[event.side].currentHp,
          }));
          setDisplayedStatus((prev) => ({
            ...prev,
            [event.side]: session.snapshot.active[event.side].status?.type ?? null,
          }));
          continue;
        }
        if (event.kind === 'status') {
          pendingStatuses.push({ side: event.side, status: event.status });
          continue;
        }
        if (event.kind === 'faint') {
          pendingFaints.push(event.side);
          continue;
        }
        if (event.kind === 'log') {
          let damageAppliedThisLog = false;
          const shouldShowStatusBeforeLog = isStatusInflictLog(event.message);
          const shouldShowStatusClearBeforeLog =
            event.message.includes('잠에서 깨어났다!') || event.message.includes('얼음이 녹았다!');
          const isForcedSwitchPrompt = event.message.includes('다음 포켓몬을 선택해 주세요.');
          if (pendingAttackSide) {
            setLatestLog({
              id: event.id,
              side: event.side,
              message: event.message,
              timestamp: Date.now(),
            });
            await sleep(LOG_TO_ATTACK_DELAY_MS);
            await playAnimationAndWait({ type: 'attack', side: pendingAttackSide });
            await sleep(ATTACK_TO_DAMAGE_DELAY_MS);
            const nextDamage = pendingDamages.shift();
            if (nextDamage) {
              await applyDamageVisual(nextDamage.side, nextDamage.amount);
              damageAppliedThisLog = true;
              damageAppliedSinceLastFaint = true;
            }
            pendingAttackSide = null;
            continue;
          }

          if (pendingDamages.length > 0) {
            const nextDamage = pendingDamages.shift()!;
            await applyDamageVisual(nextDamage.side, nextDamage.amount);
            damageAppliedThisLog = true;
            damageAppliedSinceLastFaint = true;
          }
          if ((shouldShowStatusBeforeLog || shouldShowStatusClearBeforeLog) && pendingStatuses.length > 0) {
            const nextStatus = pendingStatuses.shift()!;
            setDisplayedStatus((prev) => ({
              ...prev,
              [nextStatus.side]: nextStatus.status,
            }));
            await waitForNextPaint();
            if (shouldShowStatusBeforeLog) {
              await sleep(STEP_INTERVAL_MS);
            }
          }
          setLatestLog({
            id: event.id,
            side: event.side,
            message: event.message,
            timestamp: Date.now(),
          });
          if (pendingFaints.length > 0 && event.message.includes('쓰러졌다!')) {
            const faintSide = pendingFaints.shift()!;
            if (damageAppliedThisLog || damageAppliedSinceLastFaint) {
              await flushFaintVisual(faintSide);
            } else {
              await Promise.all([playAnimationAndWait({ type: 'faint', side: faintSide }), sleep(STEP_INTERVAL_MS)]);
            }
            damageAppliedSinceLastFaint = false;
            continue;
          }
          if (isForcedSwitchPrompt) {
            continue;
          }
          await sleep(STEP_INTERVAL_MS);
        }
      }

      while (!cancelled && pendingDamages.length > 0) {
        const nextDamage = pendingDamages.shift()!;
        await applyDamageVisual(nextDamage.side, nextDamage.amount);
        damageAppliedSinceLastFaint = true;
      }
      while (!cancelled && pendingFaints.length > 0) {
        const faintSide = pendingFaints.shift()!;
        if (damageAppliedSinceLastFaint) {
          await flushFaintVisual(faintSide);
        } else {
          await playAnimationAndWait({ type: 'faint', side: faintSide });
        }
        damageAppliedSinceLastFaint = false;
      }
      while (!cancelled && pendingStatuses.length > 0) {
        const nextStatus = pendingStatuses.shift()!;
        setDisplayedStatus((prev) => ({
          ...prev,
          [nextStatus.side]: nextStatus.status,
        }));
        await waitForNextPaint();
      }
    };

    const runSerialResolution = async () => {
      try {
        while (!cancelled) {
          const liveSession = useGameStore.getState().activeBattle;
          if (!liveSession || liveSession.id !== activeBattleId) {
            break;
          }

          await processCurrentStep(liveSession);

          const sessionAfterPlayback = useGameStore.getState().activeBattle;
          if (!sessionAfterPlayback || sessionAfterPlayback.id !== activeBattleId || cancelled) {
            break;
          }

          if (sessionAfterPlayback.status !== 'resolving') {
            clearBattleEvents();
            if (sessionAfterPlayback.snapshot.winner) {
              finalizeBattleResult();
            }
            break;
          }

          await sleep(STEP_INTERVAL_MS);
          if (cancelled) {
            break;
          }
          useGameStore.getState().advanceBattleStep();
        }
      } finally {
        isProcessingResolutionRef.current = false;
      }
    };

    void runSerialResolution();

    return () => {
      cancelled = true;
    };
  }, [
    activeBattleId,
    hasPendingStepEvents,
    introInProgress,
    clearBattleEvents,
    finalizeBattleResult,
    playAnimationAndWait,
    sleep,
    STEP_INTERVAL_MS,
    waitForNextPaint,
    DAMAGE_TO_FAINT_DELAY_MS,
    LOG_TO_ATTACK_DELAY_MS,
    ATTACK_TO_DAMAGE_DELAY_MS,
    isStatusInflictLog,
  ]);

  useEffect(
    () => () => {
      isProcessingResolutionRef.current = false;
      clearAnimationWaiter();
    },
    [clearAnimationWaiter],
  );

  useEffect(() => {
    if (!completedBattle || completedBattle.result !== 'surrender') {
      return;
    }
    if (!completedSessionId || completedSessionId === lastSurrenderAlertSessionId) {
      return;
    }
    setLastSurrenderAlertSessionId(completedSessionId);
    window.alert('항복으로 배틀이 종료되었습니다.');
  }, [completedBattle, completedSessionId, lastSurrenderAlertSessionId]);

  const currentLog = useMemo(() => {
    if (introInProgress) {
      return introLog;
    }
    return latestLog;
  }, [latestLog, introInProgress, introLog]);

  if (!isReady) {
    return (
      <div className="page battle-page">
        <div className="card">
          <h1>Battle Setup Required</h1>
          <p>Your party is empty. You need at least one Pokemon to battle.</p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="page battle-page">
        <div className="card">
          <h1>배틀 대기 중</h1>
          <p>CPU 배틀을 시작해주세요.</p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              void startCpuBattle();
            }}
          >
            배틀 시작
          </button>
        </div>
      </div>
    );
  }

  const handleResultConfirm = () => {
    acknowledgeBattleResult();
    navigate('/dashboard');
  };

  const handleSwitchSelect = (targetIndex: number) => {
    submitCommand({ kind: 'switch', targetIndex });
  };

  const handleCancelSwitch = () => {
    cancelPendingSwitch();
  };

  const switchMode: 'manual' | 'forced' | null =
    introInProgress || hasPendingStepEvents
      ? null
      : pendingSwitch === 'manual'
        ? 'manual'
        : pendingSwitch === 'forced'
          ? 'forced'
          : null;

  const switchOptions = currentSession.snapshot.bench.player
    .map((pokemon, index) => ({ pokemon, index }))
    .filter(({ pokemon }) => pokemon.currentHp > 0);

  const hpOverride: Partial<Record<BattleSide, number>> = {
    player: displayedHp.player ?? currentSession.snapshot.active.player.currentHp,
    opponent: displayedHp.opponent ?? currentSession.snapshot.active.opponent.currentHp,
  };
  const maxHpOverride: Partial<Record<BattleSide, number>> = {
    player: currentSession.snapshot.active.player.stats.hp,
    opponent: currentSession.snapshot.active.opponent.stats.hp,
  };

  return (
    <div className="page battle-page">
      <div className="battle-layout">
        <BattleStage
          session={currentSession}
          animation={currentAnimation ?? undefined}
          onAnimationComplete={handleAnimationComplete}
          showPlayer={introStep === 'player-sendout' || introStep === 'opponent-sendout' || introStep === 'done'}
          showOpponent={introStep === 'opponent-sendout' || introStep === 'done'}
          result={
            resultOverlay
              ? {
                  outcome: resultOverlay.result,
                  pointsGained: resultOverlay.pointsGained,
                  currentPoints: points,
                  onConfirm: handleResultConfirm,
                }
              : undefined
          }
        />
        <div className="battle-sidebar">
          <BattleHUD session={currentSession} hpOverride={hpOverride} maxHpOverride={maxHpOverride} statusOverride={displayedStatus} />
          <BattleLog currentLog={currentLog} />
          {activeBattle && (
            <ActionBar
              session={currentSession}
              disabled={introInProgress || hasPendingStepEvents}
              switchMode={switchMode}
              switchOptions={switchOptions}
              onSwitchSelect={handleSwitchSelect}
              onCancelSwitch={switchMode === 'manual' ? handleCancelSwitch : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
