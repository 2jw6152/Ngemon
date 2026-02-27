import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import Handlebars from 'handlebars';

interface SkillJson {
  id: string;
  name: string;
  enName?: string;
  type: string;
  category: 'physical' | 'special' | 'status';
  power: number | null;
  accuracy: number | null;
  priority: number;
  pp: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const DATA_PATH = path.join(ROOT, 'data', 'skills.json');
const GENERATED_DIR = path.join(ROOT, 'src', 'skills', 'generated');

const TEMPLATE_DIR = path.join(__dirname, 'templates');

const readTemplate = (name: string) => {
  const filePath = path.join(TEMPLATE_DIR, `${name}.ts.hbs`);
  const source = fs.readFileSync(filePath, 'utf8');
  return Handlebars.compile(source.trim());
};

const damageTemplate = readTemplate('damage');
const statusTemplate = readTemplate('status');

const slugify = (input: string) =>
  input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'skill';

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const cleanGeneratedDir = () => {
  if (!fs.existsSync(GENERATED_DIR)) {
    return;
  }
  for (const entry of fs.readdirSync(GENERATED_DIR)) {
    if (entry.endsWith('.ts')) {
      fs.unlinkSync(path.join(GENERATED_DIR, entry));
    }
  }
};

const loadSkills = (): SkillJson[] => {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error('data/skills.json 파일을 찾을 수 없습니다. 먼저 build:data 를 실행하세요.');
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw) as SkillJson[];
};

const generateSkillFile = (skill: SkillJson) => {
  const slugSource = skill.enName && skill.enName.length > 0 ? skill.enName : skill.name;
  const filename = `${skill.id}-${slugify(slugSource)}.ts`;
  const template = skill.category === 'status' || !skill.power ? statusTemplate : damageTemplate;
  const content = `${template({
    id: skill.id,
    name: skill.name,
    power: skill.power ?? 0,
    accuracyDefined: typeof skill.accuracy === 'number' && Number.isFinite(skill.accuracy),
    accuracy: skill.accuracy ?? undefined,
  })}
`;
  fs.writeFileSync(path.join(GENERATED_DIR, filename), content, 'utf8');
  return { filename, skill };
};

const generateIndex = (entries: { filename: string; skill: SkillJson }[]) => {
  const lines: string[] = [];
  lines.push("import type { SkillDefinition } from '../runtime-api';");
  lines.push('');
  entries.forEach(({ filename }, index) => {
    const importName = `skill${index.toString().padStart(3, '0')}`;
    const importPath = `./${filename.replace(/\\/g, '/').replace(/\.ts$/, '')}`;
    lines.push(`import ${importName} from '${importPath}';`);
  });
  lines.push('');
  lines.push('export const generatedSkills: SkillDefinition[] = [');
  entries.forEach(({ skill }, index) => {
    const importName = `skill${index.toString().padStart(3, '0')}`;
    lines.push(`  { id: '${skill.id}', name: '${skill.name}', handler: ${importName} },`);
  });
  lines.push('];');
  lines.push('');
  lines.push('export const findGeneratedSkill = (name: string) => generatedSkills.find((skill) => skill.name === name) ?? null;');
  lines.push('export const findGeneratedSkillById = (id: string) => generatedSkills.find((skill) => skill.id === id) ?? null;');
  fs.writeFileSync(path.join(GENERATED_DIR, 'index.ts'), lines.join('\n'), 'utf8');
};

const main = () => {
  ensureDir(GENERATED_DIR);
  cleanGeneratedDir();
  const skills = loadSkills().sort((a, b) => Number(a.id) - Number(b.id));
  const entries = skills.map(generateSkillFile);
  generateIndex(entries);
  console.log(`✅ ${entries.length}개의 기술 핸들러를 생성했습니다.`);
};

const isDirectRun = () => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return pathToFileURL(path.resolve(entry)).href === import.meta.url;
};

if (isDirectRun()) {
  main();
}
