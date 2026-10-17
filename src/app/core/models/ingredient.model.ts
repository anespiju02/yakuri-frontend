export type IngredientStatus = 'verified' | 'insufficient_data';
export type ScientificSource =
  'ECHA' | 'US EPA' | 'CosIng' | 'CosIng (Sin datos ecotox)' | 'Revisión Local';

export interface Ingredient {
  id: string;
  inci_name: string;
  synonyms: string[];
  category: string;
  /** Regla 6.2: null cuando status === 'insufficient_data' (sin peso por defecto) */
  water_impact_weight: number | null;
  status: IngredientStatus;
  justification: string;
  source: ScientificSource | null;
  source_url: string;
  last_reviewed: string;
}
