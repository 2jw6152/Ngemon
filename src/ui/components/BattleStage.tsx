
import React, { useCallback, useEffect, useRef } from 'react';
import { Application, Container, Graphics, Texture, AnimatedSprite, Sprite, Assets } from 'pixi.js';

import type { BattleSession } from '../../battle/types';
import { loadSpeciesTextures } from '../../battle/sprites';

type BattleAnimation = 
  | { type: 'attack'; side: 'player' | 'opponent' }
  | { type: 'hit'; side: 'player' | 'opponent' }
  | { type: 'faint'; side: 'player' | 'opponent' };
// import BattleBG from '../../ui/BattleBG.png';

const RESULT_LABEL: Record<'win' | 'loss' | 'surrender', string> = {
  win: '승리!',
  loss: '패배',
  surrender: '항복',
};

export interface BattleStageResult {
  outcome: 'win' | 'loss' | 'surrender';
  pointsGained: number;
  currentPoints: number;
  onConfirm: () => void;
}

export interface BattleStageProps {
  session: BattleSession;
  result?: BattleStageResult;
  animation?: BattleAnimation;
  showPlayer?: boolean;
  showOpponent?: boolean;
  onAnimationComplete?: () => void;
}

const ANIMATION_SPEED = 0.18;

// 애니메이션 함수들
const playAttackAnimation = (sprite: AnimatedSprite, targetSide: 'player' | 'opponent', onComplete?: () => void) => {
  const originalX = sprite.x;
  const moveDistance = 30; // 상대방 쪽으로 이동할 거리
  const moveDirection = targetSide === 'player' ? -1 : 1; // 플레이어는 왼쪽으로, 상대방은 오른쪽으로
  const totalDuration = 300; // ms
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / totalDuration, 1);
    
    if (progress < 1) {
      // 앞으로 이동했다가 돌아오는 애니메이션
      let offset = 0;
      if (progress < 0.3) {
        // 앞으로 이동 (0~30%)
        offset = (progress / 0.3) * moveDistance * moveDirection;
      } else if (progress < 0.7) {
        // 잠시 멈춤 (30~70%)
        offset = moveDistance * moveDirection;
      } else {
        // 돌아오기 (70~100%)
        offset = ((1 - progress) / 0.3) * moveDistance * moveDirection;
      }
      
      sprite.x = originalX + offset;
      requestAnimationFrame(animate);
    } else {
      sprite.x = originalX;
      onComplete?.();
    }
  };
  
  animate();
};

const playHitAnimation = (sprite: AnimatedSprite, onComplete?: () => void) => {
  const originalAlpha = sprite.alpha;
  const blinkDuration = 100; // ms per blink
  const totalDuration = 400; // ms total
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / totalDuration, 1);
    
    if (progress < 1) {
      const blinkPhase = Math.floor(elapsed / blinkDuration) % 2;
      sprite.alpha = blinkPhase === 0 ? 0.3 : originalAlpha;
      requestAnimationFrame(animate);
    } else {
      sprite.alpha = originalAlpha;
      onComplete?.();
    }
  };
  
  animate();
};

const playFaintAnimation = (sprite: AnimatedSprite, onComplete?: () => void) => {
  const originalY = sprite.y;
  const originalAlpha = sprite.alpha;
  const sinkDuration = 1000; // ms
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / sinkDuration, 1);
    
    if (progress < 1) {
      // 아래로 가라앉으면서 투명해짐
      sprite.y = originalY + (progress * 50);
      sprite.alpha = originalAlpha * (1 - progress);
      requestAnimationFrame(animate);
    } else {
      sprite.alpha = 0;
      onComplete?.();
    }
  };
  
  animate();
};

const makeAnimatedSprite = (textures: Texture[]) => {
  const sprite = new AnimatedSprite(textures);
  sprite.anchor.set(0.5, 1);
  sprite.animationSpeed = ANIMATION_SPEED;
  sprite.loop = true;
  sprite.play();
  return sprite;
};

const playSendOutAnimation = (sprite: AnimatedSprite) => {
  const finalY = sprite.y;
  const startY = finalY + 32;
  const duration = 320;
  const startTime = Date.now();
  sprite.alpha = 0;
  sprite.y = startY;
  sprite.visible = true;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    sprite.alpha = progress;
    sprite.y = startY - (startY - finalY) * progress;
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      sprite.alpha = 1;
      sprite.y = finalY;
    }
  };

  animate();
};

export const BattleStage: React.FC<BattleStageProps> = ({
  session,
  result,
  animation,
  showPlayer = true,
  showOpponent = true,
  onAnimationComplete,
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const stageRef = useRef<Container | null>(null);
  const backgroundRef = useRef<Sprite | null>(null);
  const playerSpriteRef = useRef<AnimatedSprite | null>(null);
  const opponentSpriteRef = useRef<AnimatedSprite | null>(null);
  const groundRef = useRef<Graphics | null>(null);
  const stageReadyRef = useRef(false);
  const prevShowPlayerRef = useRef(showPlayer);
  const prevShowOpponentRef = useRef(showOpponent);
  const showPlayerRef = useRef(showPlayer);
  const showOpponentRef = useRef(showOpponent);

  const playerInstanceId = session.snapshot.active.player.instanceId;
  const opponentInstanceId = session.snapshot.active.opponent.instanceId;
  const playerEnName = session.snapshot.active.player.enName;
  const opponentEnName = session.snapshot.active.opponent.enName;

  const applyTextures = useCallback(async () => {
    if (!stageReadyRef.current || !appRef.current) {
      return;
    }

    try {
      const [playerTextures, opponentTextures] = await Promise.all([
        loadSpeciesTextures(playerEnName, 'back'),
        loadSpeciesTextures(opponentEnName, 'front'),
      ]);

      const app = appRef.current;
      const { width, height } = app.screen;

      if (playerTextures.length > 0) {
        if (!playerSpriteRef.current) {
          const sprite = makeAnimatedSprite(playerTextures);
          sprite.scale.set(3);
          sprite.position.set(width * 0.40, height * 0.70);
          sprite.visible = false;
          sprite.alpha = 0;
          stageRef.current?.addChild(sprite);
          playerSpriteRef.current = sprite;
        } else {
          const sprite = playerSpriteRef.current;
          sprite.textures = playerTextures;
          sprite.scale.set(3);
          sprite.position.set(width * 0.40, height * 0.70);
          sprite.gotoAndPlay(0);
        }
      }

      if (opponentTextures.length > 0) {
        if (!opponentSpriteRef.current) {
          const sprite = makeAnimatedSprite(opponentTextures);
          sprite.scale.set(3);
          sprite.position.set(width * 0.70, height * 0.42);
          sprite.visible = false;
          sprite.alpha = 0;
          stageRef.current?.addChild(sprite);
          opponentSpriteRef.current = sprite;
        } else {
          const sprite = opponentSpriteRef.current;
          sprite.textures = opponentTextures;
          sprite.scale.set(3);
          sprite.position.set(width * 0.70, height * 0.42);
          sprite.gotoAndPlay(0);
        }
      }

      const shouldShowPlayer = showPlayerRef.current;
      if (playerSpriteRef.current) {
        if (shouldShowPlayer) {
          if (!prevShowPlayerRef.current) {
            playSendOutAnimation(playerSpriteRef.current);
          } else {
            playerSpriteRef.current.visible = true;
            playerSpriteRef.current.alpha = 1;
          }
        } else {
          playerSpriteRef.current.visible = false;
          playerSpriteRef.current.alpha = 0;
        }
      }

      const shouldShowOpponent = showOpponentRef.current;
      if (opponentSpriteRef.current) {
        if (shouldShowOpponent) {
          if (!prevShowOpponentRef.current) {
            playSendOutAnimation(opponentSpriteRef.current);
          } else {
            opponentSpriteRef.current.visible = true;
            opponentSpriteRef.current.alpha = 1;
          }
        } else {
          opponentSpriteRef.current.visible = false;
          opponentSpriteRef.current.alpha = 0;
        }
      }

      prevShowPlayerRef.current = shouldShowPlayer;
      prevShowOpponentRef.current = shouldShowOpponent;
    } catch (error) {
      console.error('Failed to load battle sprites', error);
    }
  }, [playerEnName, opponentEnName]);

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) {
      return;
    }

    host.style.width = '100%';
    host.style.height = '100%';

    let isUnmounted = false;
    const app = new Application();

      const setup = async () => {
      try {
        await app.init({
          background: '#0c1020',
          width: host.clientWidth || 640,
          height: host.clientHeight || 360,
        });
      } catch (error) {
        console.error('Pixi initialization failed', error);
        return;
      }

      if (isUnmounted || !host.isConnected) {
        app.destroy(true);
        return;
      }

      host.innerHTML = '';
      host.appendChild(app.canvas);
      appRef.current = app;

      const stage = new Container();
      stageRef.current = stage;
      app.stage.addChild(stage);

      // 배경 이미지 설정
      try {
        const backgroundTexture = await Assets.load('/BattleBG.png');
        const backgroundSprite = new Sprite(backgroundTexture);
        backgroundSprite.anchor.set(0, 0);
        stage.addChild(backgroundSprite);
        backgroundRef.current = backgroundSprite;
      } catch (error) {
        console.warn('Failed to load background image:', error);
        // 배경 로드 실패 시 기본 배경색 사용
      }

      const resize = () => {
        if (!canvasRef.current || !appRef.current) {
          return;
        }
        const width = canvasRef.current.clientWidth || 640;
        const height = Math.max(canvasRef.current.clientHeight, 360);
        appRef.current.renderer.resize(width, height);
        
        // 배경 크기 조정
        if (backgroundRef.current) {
          const background = backgroundRef.current;
          background.width = width;
          background.height = height;
        }
        
        // Ground 제거 - 배경 이미지 사용
        // if (groundRef.current) {
        //   const ground = groundRef.current;
        //   ground.clear();
        //   ground.roundRect(40, height * 0.65, width - 80, 60, 28);
        //   ground.fill({ color: 0x141a2a, alpha: 0.6 });
        // }
        if (playerSpriteRef.current) {
          playerSpriteRef.current.position.set(width * 0.40, height * 0.70);
        }
        if (opponentSpriteRef.current) {
          opponentSpriteRef.current.position.set(width * 0.70, height * 0.42);
        }
      };

      const width = host.clientWidth || 640;
      const height = Math.max(host.clientHeight, 360);
      app.renderer.resize(width, height);

      // 초기 배경 크기 설정
      if (backgroundRef.current) {
        backgroundRef.current.width = width;
        backgroundRef.current.height = height;
      }

      // Ground 제거 - 배경 이미지 사용
      // const ground = new Graphics();
      // ground.roundRect(40, height * 0.65, width - 80, 60, 28);
      // ground.fill({ color: 0x141a2a, alpha: 0.6 });
      // stage.addChild(ground);
      // groundRef.current = ground;

      stageReadyRef.current = true;
      window.addEventListener('resize', resize);
      resize();
      void applyTextures();

      return () => {
        window.removeEventListener('resize', resize);
      };
    };

    const cleanupPromise = setup();

    return () => {
      isUnmounted = true;
      stageReadyRef.current = false;
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });

      if (backgroundRef.current) {
        backgroundRef.current.destroy();
        backgroundRef.current = null;
      }

      if (playerSpriteRef.current) {
        playerSpriteRef.current.destroy();
        playerSpriteRef.current = null;
      }

      if (opponentSpriteRef.current) {
        opponentSpriteRef.current.destroy();
        opponentSpriteRef.current = null;
      }

      if (appRef.current) {
        try {
          appRef.current.destroy(true);
        } catch (error) {
          console.warn('Pixi destroy failed', error);
        }
        appRef.current = null;
      }
      stageRef.current = null;
      groundRef.current = null;

      if (host.isConnected) {
        host.innerHTML = '';
      }
    };
  }, [session.id, applyTextures]);

  useEffect(() => {
    void applyTextures();
  }, [applyTextures, playerInstanceId, opponentInstanceId, session.snapshot.turn]);

  useEffect(() => {
    showPlayerRef.current = showPlayer;
  }, [showPlayer]);

  useEffect(() => {
    showOpponentRef.current = showOpponent;
  }, [showOpponent]);

  useEffect(() => {
    const playerSprite = playerSpriteRef.current;
    if (playerSprite) {
      if (!prevShowPlayerRef.current && showPlayer) {
        playSendOutAnimation(playerSprite);
      } else {
        playerSprite.visible = showPlayer;
        playerSprite.alpha = showPlayer ? 1 : 0;
      }
    }
    prevShowPlayerRef.current = showPlayer;
  }, [showPlayer]);

  useEffect(() => {
    const opponentSprite = opponentSpriteRef.current;
    if (opponentSprite) {
      if (!prevShowOpponentRef.current && showOpponent) {
        playSendOutAnimation(opponentSprite);
      } else {
        opponentSprite.visible = showOpponent;
        opponentSprite.alpha = showOpponent ? 1 : 0;
      }
    }
    prevShowOpponentRef.current = showOpponent;
  }, [showOpponent]);

  // 애니메이션 처리
  useEffect(() => {
    if (!animation) return;

    const { type, side } = animation;
    console.log('애니메이션 트리거:', { type, side });
    
    if (type === 'attack') {
      const attackerSprite = side === 'player' ? playerSpriteRef.current : opponentSpriteRef.current;
      console.log('공격 애니메이션 스프라이트:', !!attackerSprite);
      if (attackerSprite) {
        const targetSide = side === 'player' ? 'opponent' : 'player';
        playAttackAnimation(attackerSprite, targetSide, onAnimationComplete);
      } else {
        onAnimationComplete?.();
      }
    } else if (type === 'hit') {
      const hitSprite = side === 'player' ? playerSpriteRef.current : opponentSpriteRef.current;
      console.log('피해 애니메이션 스프라이트:', !!hitSprite);
      if (hitSprite) {
        playHitAnimation(hitSprite, onAnimationComplete);
      } else {
        onAnimationComplete?.();
      }
    } else if (type === 'faint') {
      const faintSprite = side === 'player' ? playerSpriteRef.current : opponentSpriteRef.current;
      console.log('쓰러짐 애니메이션 스프라이트:', !!faintSprite);
      if (faintSprite) {
        playFaintAnimation(faintSprite, onAnimationComplete);
      } else {
        onAnimationComplete?.();
      }
    }
  }, [animation, onAnimationComplete]);

  return (
    <div className="battle-stage">
      <div className="battle-stage__canvas" ref={canvasRef} />
      {result && (
        <div className="battle-stage__result">
          <div className="battle-stage__result-card">
            <h2>{RESULT_LABEL[result.outcome]}</h2>
            <p>
              {result.outcome === 'win' && (
                <>
                  획득한 포인트 <strong>{result.pointsGained}</strong>
                  <br />
                </>
              )}
              현재 보유 포인트 <strong>{result.currentPoints}</strong>
            </p>
            <button type="button" className="primary" onClick={result.onConfirm}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


