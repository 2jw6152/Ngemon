import React, { useEffect, useRef } from 'react';
import { Application, Graphics } from 'pixi.js';

export interface SparkleFXProps {
  duration?: number;
}

export const SparkleFX: React.FC<SparkleFXProps> = ({ duration = 1500 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) {
      return;
    }

    const app = new Application();

    const setup = async () => {
      try {
      await app.init({
        backgroundAlpha: 0,
        width: host.clientWidth || 240,
        height: host.clientHeight || 240,
      });
      host.appendChild(app.canvas);

      const sparkle = new Graphics();
      sparkle.circle(0, 0, 4);
      sparkle.fill(0xfff0c8);
      sparkle.position.set(app.screen.width / 2, app.screen.height / 2);

      app.stage.addChild(sparkle);

      const start = performance.now();
      app.ticker.add(() => {
        const elapsed = performance.now() - start;
        const progress = Math.min(1, elapsed / duration);
        sparkle.alpha = 1 - progress;
        sparkle.scale.set(1 + progress * 3);
        sparkle.rotation += 0.02;
        if (progress >= 1) {
            try {
              app.ticker.stop();
              app.destroy(true, { children: true, texture: true, baseTexture: true });
            } catch (error) {
              console.warn('[SparkleFX] destroy failed', error);
            }
            if (host.isConnected) {
              host.innerHTML = '';
            }
          }
        });
      } catch (error) {
        console.warn('[SparkleFX] init failed', error);
        try {
          app.destroy(true, { children: true, texture: true, baseTexture: true });
        } catch (destroyError) {
          console.warn('[SparkleFX] destroy failed', destroyError);
        }
        if (host.isConnected) {
          host.innerHTML = '';
        }
      }
    };

    void setup();

    return () => {
      try {
        app.ticker.stop();
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      } catch (error) {
        console.warn('[SparkleFX] cleanup failed', error);
      }
      if (host.isConnected) {
      host.innerHTML = '';
      }
    };
  }, [duration]);

  return <div className="sparkle-fx" ref={containerRef} />;
};
