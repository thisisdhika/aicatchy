export interface OutfitFormula {
  id: string;
  name: string;
  description?: string;
  // Phase 0 stub: minimal properties
  occasion?: string;
  vibes?: string[];
  style?: string;
}

export enum FormulaType {
  BASIC = 'basic',
  ADVANCED = 'advanced'
}