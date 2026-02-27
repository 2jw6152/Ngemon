import typeChartData from '../../data/typeChart.json';

import type { ElementType } from './types';

type TypeChart = Record<ElementType, Partial<Record<ElementType, number>>>;

const chart = typeChartData as TypeChart;

export const getTypeMultiplier = (attackType: ElementType, defenderTypes: ElementType[]) =>
  defenderTypes.reduce((acc, defenderType) => acc * (chart[attackType]?.[defenderType] ?? 1), 1);

export const getTypeChart = () => chart;
