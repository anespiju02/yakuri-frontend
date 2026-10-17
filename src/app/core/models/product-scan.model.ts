import { Ingredient } from './ingredient.model';

export type WaterImpactGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'N/A';

export interface ScanRequestPayload {
  raw_ocr_text: string;
  product_name?: string;
  /** Regla 6.1: Ignorados explícitamente por el motor de puntaje */
  brand_ignored?: string;
  price_pen_ignored?: number;
}

export interface ProductScanResult {
  scan_id: string;
  raw_ocr_text: string;
  matched_ingredients: string[];
  unmatched_text_fragments: string[];
  insufficient_data_ingredients: string[];
  water_impact_score: WaterImpactGrade;
  score_numeric: number | null;
  explanation: string;
  alternatives: string[];
  timestamp: string;
  traceability_details: Ingredient[];
}
