const fs = require('fs');
const path = require('path');
const data = require('./rank_skills.json');

const statMap = {
  'Attack': 'atk',
  'Defense': 'def',
  'Special Attack': 'spa',
  'Special Defense': 'spd',
  'Speed': 'spe',
  'accuracy': 'accuracy',
  'evasion': 'evasion'
};

const numberWords = {
  'one': 1,
  'two': 2,
  'three': 3
};

let implementedCount = 0;
let skippedCount = 0;

data.forEach(skill => {
  const id = skill.id;
  const enName = skill.enName.toLowerCase().replace(/ /g, '-');
  const filePath = path.join(__dirname, `src/skills/generated/${id}-${enName}.ts`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  파일 없음: ${filePath}`);
    skippedCount++;
    return;
  }
  
  const desc = skill.desc;
  const changes = {};
  let targetSide = null;
  const isAfterDamage = desc.includes('after inflicting damage');
  const hasChance = desc.match(/(\d+)% chance/);
  
  // 100% 미만 확률 기술은 스킵 (나중에 수동 구현)
  if (hasChance && parseInt(hasChance[1]) < 100) {
    console.log(`⏭️  ${skill.name}: 확률 기술 (${hasChance[1]}%) - 수동 구현 필요`);
    skippedCount++;
    return;
  }
  
  // 특수 케이스들 스킵
  if (desc.includes('faints') || 
      desc.includes('KO') || 
      desc.includes('all') ||
      desc.includes('friendly') ||
      desc.includes('ally') ||
      desc.includes('charges') ||
      desc.includes('switch') ||
      desc.includes('PP') ||
      desc.includes('confuse') ||
      desc.includes('gender') ||
      desc.includes('poisoned') ||
      desc.includes('weight') ||
      desc.includes('Heals')) {
    console.log(`⏭️  ${skill.name}: 복잡한 로직 - 수동 구현 필요`);
    skippedCount++;
    return;
  }
  
  // 대상 결정
  if (desc.includes("user's") || desc.includes("user's")) {
    targetSide = null; // 자신
  } else if (desc.includes("target's") || desc.includes("target's")) {
    targetSide = "'opponent'"; // 상대
  }
  
  // Raises 패턴 매칭
  const raiseMatches = [...desc.matchAll(/Raises.*?(?:the\s+)?(?:user's|target's)?\s*(\w+(?:\s+\w+)?)\s+by\s+(\w+)\s+stage/gi)];
  raiseMatches.forEach(match => {
    const stat = match[1].trim();
    const amountWord = match[2].toLowerCase();
    const amount = numberWords[amountWord] || 1;
    const mappedStat = statMap[stat];
    if (mappedStat) {
      changes[mappedStat] = amount;
    }
  });
  
  // Lowers 패턴 매칭
  const lowerMatches = [...desc.matchAll(/Lowers.*?(?:the\s+)?(?:user's|target's)?\s*(\w+(?:\s+\w+)?)\s+by\s+(\w+)\s+stage/gi)];
  lowerMatches.forEach(match => {
    const stat = match[1].trim();
    const amountWord = match[2].toLowerCase();
    const amount = numberWords[amountWord] || 1;
    const mappedStat = statMap[stat];
    if (mappedStat) {
      changes[mappedStat] = -amount;
    }
  });
  
  if (Object.keys(changes).length === 0) {
    console.log(`❌ ${skill.name}: 파싱 실패 - ${desc}`);
    skippedCount++;
    return;
  }
  
  // 파일 생성
  const changesStr = JSON.stringify(changes, null, 2).replace(/"/g, '');
  const targetSideArg = targetSide ? `, ${targetSide}` : '';
  
  const content = `import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // ${skill.name}: ${desc.replace(/\?/g, "'")}
  ${isAfterDamage ? '// TODO: 데미지를 입힌 후에 적용되어야 함 (현재는 즉시 적용됨)\n  ' : ''}ops.changeStatRanks(${changesStr}${targetSideArg});
};

export default handler;
`;
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${skill.name} (${id}): ${JSON.stringify(changes)} ${targetSide || 'self'}`);
  implementedCount++;
});

console.log(`\n🎉 완료! 구현: ${implementedCount}개, 스킵: ${skippedCount}개`);

