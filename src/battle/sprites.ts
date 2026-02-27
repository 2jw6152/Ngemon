import { Assets, Texture, Rectangle } from 'pixi.js';
import { hasFrameSuffix } from '../utils/pokemon-name';

export type SpriteVariant = 'front' | 'back';

const textureCache = new Map<string, Texture[]>();
const pendingLoads = new Map<string, Promise<Texture[]>>();

const normalizeEnNameForSprite = (enName: string) => enName.trim();

const withDefaultFrameSuffix = (name: string) => (hasFrameSuffix(name) ? name : `${name}_1`);

const toCandidates = (rawName: string) => {
  const compact = rawName.replace(/\s+/g, '_');
  const normalized = compact.replace(/-+/g, '_');
  const dehyphenated = rawName.replace(/-/g, '');
  const alnumOnly = rawName.replace(/[^a-zA-Z0-9]/g, '');
  const compactDehyphenated = compact.replace(/-/g, '');
  const normalizedDehyphenated = normalized.replace(/_/g, '');
  const compactWithFrame = withDefaultFrameSuffix(compact);
  const normalizedWithFrame = withDefaultFrameSuffix(normalized);
  const rawWithFrame = withDefaultFrameSuffix(rawName);
  const dehyphenatedWithFrame = withDefaultFrameSuffix(dehyphenated);
  const alnumOnlyWithFrame = withDefaultFrameSuffix(alnumOnly);
  const compactDehyphenatedWithFrame = withDefaultFrameSuffix(compactDehyphenated);
  const normalizedDehyphenatedWithFrame = withDefaultFrameSuffix(normalizedDehyphenated);
  const variants = new Set<string>([
    // Prefer compact/alnum variants first so names like WALKING-WAKE resolve to WALKINGWAKE quickly.
    alnumOnly,
    alnumOnlyWithFrame,
    dehyphenated,
    dehyphenatedWithFrame,
    compact,
    compactWithFrame,
    compactDehyphenated,
    compactDehyphenatedWithFrame,
    normalized,
    normalizedWithFrame,
    normalizedDehyphenated,
    normalizedDehyphenatedWithFrame,
    rawName,
    rawWithFrame,
    // Case variants
    alnumOnly.toUpperCase(),
    alnumOnlyWithFrame.toUpperCase(),
    dehyphenated.toUpperCase(),
    dehyphenatedWithFrame.toUpperCase(),
    compact.toUpperCase(),
    compactWithFrame.toUpperCase(),
    compactDehyphenated.toUpperCase(),
    compactDehyphenatedWithFrame.toUpperCase(),
    normalized.toUpperCase(),
    normalizedWithFrame.toUpperCase(),
    normalizedDehyphenated.toUpperCase(),
    normalizedDehyphenatedWithFrame.toUpperCase(),
    rawName.toUpperCase(),
    rawWithFrame.toUpperCase(),
    alnumOnly.toLowerCase(),
    alnumOnlyWithFrame.toLowerCase(),
    dehyphenated.toLowerCase(),
    dehyphenatedWithFrame.toLowerCase(),
    compact.toLowerCase(),
    compactWithFrame.toLowerCase(),
    compactDehyphenated.toLowerCase(),
    compactDehyphenatedWithFrame.toLowerCase(),
    normalized.toLowerCase(),
    normalizedWithFrame.toLowerCase(),
    normalizedDehyphenated.toLowerCase(),
    normalizedDehyphenatedWithFrame.toLowerCase(),
    rawName.toLowerCase(),
    rawWithFrame.toLowerCase(),
  ]);
  return Array.from(variants);
};

const sliceBySquareFrames = (texture: Texture) => {
  const width = texture.width;
  const height = texture.height;
  const frameCount = Math.max(1, Math.floor(width / Math.max(1, height)));
  if (frameCount <= 1) {
    return [texture];
  }
  const frames: Texture[] = [];
  const baseTexture = texture.baseTexture;
  const frameSize = height;

  for (let index = 0; index < frameCount; index += 1) {
    const rect = new Rectangle(index * frameSize, 0, frameSize, frameSize);
    const frameTexture = new Texture({
        source: baseTexture,
        frame: rect,
      });
      frames.push(frameTexture);
  }

  return frames.length > 0 ? frames : [texture];
};

const variantToDir = (variant: SpriteVariant) => (variant === 'back' ? 'Back' : 'Front');

const isTextureUsable = (texture: Texture | null | undefined) => {
  if (!texture) {
    return false;
  }
  try {
    const width = texture.width;
    const height = texture.height;
    return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
  } catch {
    return false;
  }
};

const tryLoadTexture = async (variant: SpriteVariant, enName: string) => {
  const normalized = normalizeEnNameForSprite(enName);
  const candidates = normalized === enName ? toCandidates(enName) : [...toCandidates(normalized), ...toCandidates(enName)];
  const dir = variantToDir(variant);
  let lastError: unknown = null;
  for (const candidate of candidates) {
    try {
      const imageUrl = new URL(`../../Images/${dir}/${candidate}.png`, import.meta.url).href;
      const texture = (await Assets.load<Texture>(imageUrl)) as Texture;
      if (!isTextureUsable(texture)) {
        throw new Error(`Loaded texture is invalid for ${dir}/${candidate}.png`);
      }
      return texture;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`스프라이트 파일을 찾을 수 없습니다: ${dir}/${enName}.png (${String((lastError as Error | null)?.message ?? lastError)})`);
};

export const loadSpeciesTextures = async (enName: string, variant: SpriteVariant = 'front') => {
  const normalized = normalizeEnNameForSprite(enName);
  const cacheKey = `${variant}:${normalized}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  if (pendingLoads.has(cacheKey)) {
    return pendingLoads.get(cacheKey)!;
  }

  const loadPromise = (async () => {
    const baseTexture = await tryLoadTexture(variant, normalized);
    const frames = sliceBySquareFrames(baseTexture);

    if (frames.length <= 1) {
      console.warn(`[sprites] only ${frames.length} frame(s) detected for ${variant}:${normalized}`);
    }

    textureCache.set(cacheKey, frames);
    return frames;
  })();

  pendingLoads.set(cacheKey, loadPromise);

  try {
    return await loadPromise;
  } finally {
    pendingLoads.delete(cacheKey);
  }
};
