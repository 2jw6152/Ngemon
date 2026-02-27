import speciesData from '../../data/pokemon.json';
import skillsData from '../../data/skills.json';

import type { SpeciesData, SkillData } from '../battle/types';

const speciesCatalog = speciesData as SpeciesData[];
const skillCatalog = skillsData as SkillData[];

export const loadSpeciesCatalog = async () => speciesCatalog;

export const loadSkillCatalog = async () => skillCatalog;

export const getSpeciesByEnglishName = async (enName: string) =>
  speciesCatalog.find((species) => species.enName.toLowerCase() === enName.toLowerCase()) ?? null;

export const getRandomSpecies = async () => speciesCatalog[Math.floor(Math.random() * speciesCatalog.length)];
