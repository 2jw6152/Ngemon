import React, { useEffect, useRef, useState } from 'react';
import { AnimatedSprite, Application, Container } from 'pixi.js';

import { loadSpeciesTextures } from '../../battle/sprites';
import { toDisplayPokemonName } from '../../utils/pokemon-name';

const DEFAULT_SIZE = 160;
const ANIMATION_SPEED = 0.18;

export interface SpeciesSpriteProps {
  enName: string;
  size?: number;
  variant?: 'front' | 'back';
  className?: string;
  fallback?: React.ReactNode;
}

export const SpeciesSprite: React.FC<SpeciesSpriteProps> = ({
  enName,
  size = DEFAULT_SIZE,
  variant = 'front',
  className,
  fallback,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const spriteRef = useRef<AnimatedSprite | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const teardown = () => {
      if (spriteRef.current) {
        spriteRef.current.destroy();
        spriteRef.current = null;
      }
      if (appRef.current) {
        try {
          appRef.current.destroy(true);
        } catch (error) {
          console.warn('Failed to destroy sprite application', error);
        }
        appRef.current = null;
      }
    };

    const init = async () => {
      const host = hostRef.current;
      if (!host) {
        return;
      }

      teardown();
      setFailed(false);

      const app = new Application();
      try {
        await app.init({
          width: size,
          height: size,
          backgroundAlpha: 0,
        });
      } catch (error) {
        console.error('Failed to initialise sprite renderer', error);
        teardown();
        setFailed(true);
        return;
      }

      if (isCancelled) {
        app.destroy(true);
        return;
      }

      appRef.current = app;

      host.innerHTML = '';
      host.appendChild(app.canvas);

      try {
        const textures = await loadSpeciesTextures(enName, variant);
        if (!textures.length) {
          throw new Error(`No frames available for ${enName}`);
        }
        if (isCancelled) {
          return;
        }

        const sprite = new AnimatedSprite(textures);
        sprite.anchor.set(0.5, 1);
        sprite.animationSpeed = ANIMATION_SPEED;
        sprite.loop = true;

        const frameWidth = textures[0]?.width ?? 1;
        const frameHeight = textures[0]?.height ?? 1;
        const maxDimension = Math.max(frameWidth, frameHeight, 1);
        const scale = ((size || DEFAULT_SIZE) * 0.7) / maxDimension;
        sprite.scale.set(scale);
        sprite.position.set(app.screen.width / 2, app.screen.height * 0.92);
        sprite.play();

        const stage = new Container();
        stage.addChild(sprite);
        app.stage.removeChildren();
        app.stage.addChild(stage);
        spriteRef.current = sprite;
      } catch (error) {
        console.error('Failed to load species sprite', error);
        if (!isCancelled) {
          setFailed(true);
        }
        teardown();
      }
    };

    void init();

    return () => {
      isCancelled = true;
      teardown();
    };
  }, [enName, size, variant]);

  return (
    <div className={`species-sprite ${className ?? ''}`} style={{ width: size, height: size }}>
      {!failed && <div ref={hostRef} className="species-sprite__canvas" />}
      {failed && (
        <div className="species-sprite__fallback">
          {fallback ?? <span>{toDisplayPokemonName(enName)}</span>}
        </div>
      )}
    </div>
  );
};
