import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import xlsx from 'xlsx';

import type { ElementType, SpeciesData, SkillData, SkillCategory } from '../battle/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const POKEMON_XLSX = path.join(ROOT, 'pokemon_list_filled.xlsx');
const SKILL_XLSX = path.join(ROOT, 'skill_list.xlsx');
const TYPE_CHART_SOURCE = path.join(ROOT, 'pokemon_type_chart.json');
const TYPE_CHART_TARGET = path.join(DATA_DIR, 'typeChart.json');
const POKEMON_JSON = path.join(DATA_DIR, 'pokemon.json');
const SKILLS_JSON = path.join(DATA_DIR, 'skills.json');

const HANGUL_REGEX = /[\u3131-\u318E\uAC00-\uD7A3]/;

const CATEGORY_MAP: Record<string, SkillCategory> = {
  물리: 'physical',
  특수: 'special',
  변화: 'status',
};

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const parseLearnset = (raw: unknown): string[] => {
  if (!raw || typeof raw !== 'string') {
    return [];
  }
  const moves = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && HANGUL_REGEX.test(entry));
  return Array.from(new Set(moves));
};

const pick = (record: Record<string, unknown>, candidates: string[]): unknown => {
  for (const key of candidates) {
    if (record[key] !== undefined && record[key] !== null && String(record[key]).trim().length > 0) {
      return record[key];
    }
  }
  return undefined;
};

const parsePokemonSheet = (): SpeciesData[] => {
  if (!fs.existsSync(POKEMON_XLSX)) {
    throw new Error('pokemon_list_filled.xlsx 파일을 찾을 수 없습니다.');
  }
  const workbook = xlsx.readFile(POKEMON_XLSX);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  return rows.map((row) => {
    const koName = String(
      pick(row, ['이름', '포켓몬이름', '포켓몬 이름', '한글명', '�̸�']),
    ).trim();
    const enNameRaw = String(
      pick(row, ['영문명', '영문 이름', '영어 이름', 'Species', 'species', '������']),
    ).trim();
    const slugSource = enNameRaw.length > 0 ? enNameRaw : koName;
    const slug = slugSource
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const stats = {
      hp: toNumber(pick(row, ['체력', 'HP', 'hp', '�ü�', 'ü��'])) ?? 1,
      atk: toNumber(pick(row, ['공격', '공격력', 'atk', 'ATK', '���ݷ�'])) ?? 1,
      def: toNumber(pick(row, ['방어', '방어력', 'def', 'DEF', '���'])) ?? 1,
      spa: toNumber(pick(row, ['특수공격', '특공', 'spa', 'SpA', 'Ư������'])) ?? 1,
      spd: toNumber(pick(row, ['특수방어', '특방', 'spd', 'SpD', 'Ư�����'])) ?? 1,
      spe: toNumber(pick(row, ['스피드', 'speed', 'SPE', '���ǵ�'])) ?? 1,
      total: toNumber(pick(row, ['총합', '합계', '총 능력치', '����'])) ?? 0,
    };
    const types = [pick(row, ['타입_1', '타입1', 'primary_type', 'Ÿ��_1']), pick(row, ['타입_2', '타입2', 'secondary_type', 'Ÿ��_2'])]
      .map((value) => String(value).trim().toLowerCase())
      .filter((value) => value.length > 0) as ElementType[];

    return {
      koName,
      enName: enNameRaw || slugSource,
      slug,
      stats,
      types,
      learnset: parseLearnset(pick(row, ['기술', '기술목록', '기술 리스트', '���'])),
    } satisfies SpeciesData;
  });
};

const parseSkillSheet = (): SkillData[] => {
  const workbook = xlsx.readFile(SKILL_XLSX);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  return rows.map((row) => {
    const categoryRaw = String(row['카테고리(물리/특수/변화)']).trim();
    const category = CATEGORY_MAP[categoryRaw] ?? 'status';
    const power = toNumber(row['위력']);
    const accuracy = toNumber(row['명중률']);

    return {
      id: String(row.ID ?? row['ID']).padStart(3, '0'),
      name: String(row['기술 이름']).trim(),
      enName: String(row['영문명']).trim(),
      type: String(row['타입']).trim().toLowerCase() as ElementType,
      category,
      power,
      accuracy,
      priority: toNumber(row['우선도']) ?? 0,
      pp: toNumber(row.pp ?? row['pp']) ?? 0,
      effects: [],
      description: String(row['효과 설명']).trim(),
    } satisfies SkillData;
  });
};

const copyTypeChart = () => {
  if (!fs.existsSync(TYPE_CHART_SOURCE)) {
    throw new Error('pokemon_type_chart.json 파일을 찾을 수 없습니다.');
  }
  const payload = fs.readFileSync(TYPE_CHART_SOURCE, 'utf8');
  fs.writeFileSync(TYPE_CHART_TARGET, payload, 'utf8');
};

const writeJson = (filePath: string, data: unknown) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ ${path.relative(ROOT, filePath)} 작성 완료`);
};

const main = () => {
  ensureDataDir();
  const pokemon = parsePokemonSheet();
  const skills = parseSkillSheet();

  writeJson(POKEMON_JSON, pokemon);
  writeJson(SKILLS_JSON, skills);
  copyTypeChart();
  console.log('데이터 빌드가 완료되었습니다.');
};

const isDirectRun = () => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return pathToFileURL(entry).href === import.meta.url;
};

if (isDirectRun()) {
  main();
}
