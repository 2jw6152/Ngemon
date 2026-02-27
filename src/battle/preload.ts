import { loadSpeciesTextures } from './sprites';

export const preloadSpeciesTextures = (names: Array<string | undefined | null>) =>
  Promise.all(
    names
      .filter((name): name is string => typeof name === 'string' && name.length > 0)
      .map((name) =>
        Promise.all([loadSpeciesTextures(name, 'front'), loadSpeciesTextures(name, 'back')]).catch((error) => {
          console.warn(`[sprites] preload failed for ${name}`, error);
        }),
      ),
  ).then(() => undefined);
