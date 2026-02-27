import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const IMAGE_DIR = path.join(ROOT, 'Images');
const DATA_DIR = path.join(ROOT, 'data');
const MANIFEST_PATH = path.join(DATA_DIR, 'sprites-meta.json');
const GENERATED_DIR = path.join(IMAGE_DIR, '_generated');

type FrameSegment = { start: number; end: number };

type ManifestEntry = {
  file: string;
  width: number;
  height: number;
  frameCount: number;
};

type Manifest = Record<string, ManifestEntry>;

const columnHasOpaquePixel = (png: PNG, column: number) => {
  const { width, height, data } = png;
  if (column < 0 || column >= width) {
    return false;
  }
  for (let y = 0; y < height; y += 1) {
    const idx = (width * y + column) << 2;
    if (data[idx + 3] > 0) {
      return true;
    }
  }
  return false;
};

const detectSegments = (png: PNG): FrameSegment[] => {
  const segments: FrameSegment[] = [];
  const { width } = png;
  let cursor = 0;

  while (cursor < width) {
    while (cursor < width && !columnHasOpaquePixel(png, cursor)) {
      cursor += 1;
    }
    if (cursor >= width) {
      break;
    }
    const start = cursor;
    while (cursor < width && columnHasOpaquePixel(png, cursor)) {
      cursor += 1;
    }
    const end = cursor;
    if (end > start) {
      segments.push({ start, end });
    }
  }

  return segments;
};

const fallbackSegments = (png: PNG): FrameSegment[] => {
  const { width, height } = png;
  if (width === 0 || height === 0) {
    return [{ start: 0, end: width }];
  }
  const approximate = Math.max(1, Math.round(width / height));
  const frameWidth = Math.max(1, Math.round(width / approximate));
  const segments: FrameSegment[] = [];
  for (let i = 0; i < approximate; i += 1) {
    const start = i * frameWidth;
    const end = i === approximate - 1 ? width : Math.min(width, (i + 1) * frameWidth);
    segments.push({ start, end });
  }
  return segments;
};

const buildManifestEntry = (file: string, png: PNG, frameCount: number): ManifestEntry => ({
  file,
  width: png.width,
  height: png.height,
  frameCount: Math.max(1, frameCount || 1),
});

const getFrameCountFromGenerated = async (baseName: string) => {
  const dir = path.join(GENERATED_DIR, baseName);
  try {
    const files = await fs.readdir(dir);
    return files.filter((file) => file.toLowerCase().endsWith('.png')).length;
  } catch {
    return null;
  }
};

const generateManifest = async () => {
  const entries = await fs.readdir(IMAGE_DIR);
  const manifest: Manifest = {};

  for (const file of entries) {
    if (!file.toLowerCase().endsWith('.png')) {
      continue;
    }

    const filePath = path.join(IMAGE_DIR, file);
    const baseName = path.basename(file, '.png');
    const buffer = await fs.readFile(filePath);
    const png = PNG.sync.read(buffer);

    const generatedCount = await getFrameCountFromGenerated(baseName);
    let frameCount = generatedCount ?? 0;
    if (!frameCount) {
      let segments = detectSegments(png);
      if (segments.length <= 1) {
        segments = fallbackSegments(png);
      }
      frameCount = segments.length;
    }

    manifest[baseName] = buildManifestEntry(file, png, frameCount);
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  await fs.rm(GENERATED_DIR, { recursive: true, force: true });

  console.log(`✅ sprites-meta.json 생성 완료 (포켓몬 ${Object.keys(manifest).length}종)`);
};

await generateManifest();
