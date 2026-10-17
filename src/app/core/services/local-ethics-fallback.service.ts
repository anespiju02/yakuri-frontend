import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import {
  ProductScanResult,
  ScanRequestPayload,
  WaterImpactGrade,
} from '../models/product-scan.model';

@Injectable({ providedIn: 'root' })
export class LocalEthicsFallbackService {
  private readonly db: Ingredient[] = [
    {
      id: 'ing_0001',
      inci_name: 'Sodium Laureth Sulfate',
      synonyms: ['sles', 'sodium laureth sulphate'],
      category: 'tensioactivo',
      water_impact_weight: 0.6,
      status: 'verified',
      justification:
        'Biodegradable pero puede afectar organismos acuáticos en concentraciones altas.',
      source: 'ECHA',
      source_url: 'https://echa.europa.eu/',
      last_reviewed: '2026-01-15',
    },
    {
      id: 'ing_0002',
      inci_name: 'Triclosan',
      synonyms: ['irgasan'],
      category: 'antibacteriano',
      water_impact_weight: 0.95,
      status: 'verified',
      justification:
        'Altamente tóxico para algas y fauna acuática con potencial de bioacumulación.',
      source: 'US EPA',
      source_url: 'https://comptox.epa.gov/dashboard/',
      last_reviewed: '2026-01-20',
    },
    {
      id: 'ing_0003',
      inci_name: 'Cocamidopropyl Betaine',
      synonyms: ['capb'],
      category: 'tensioactivo',
      water_impact_weight: 0.35,
      status: 'verified',
      justification:
        'Tensioactivo anfótero con toxicidad acuática moderada-baja y rápida degradación.',
      source: 'CosIng',
      source_url: 'https://ec.europa.eu/growth/tools-databases/cosing/',
      last_reviewed: '2026-02-02',
    },
    {
      id: 'ing_0004',
      inci_name: 'Sodium Tripolyphosphate',
      synonyms: ['stpp', 'tripolifosfato de sodio'],
      category: 'secuestrante / fosfato',
      water_impact_weight: 0.88,
      status: 'verified',
      justification:
        'Promueve la eutrofización severa en cuerpos de agua dulce y proliferación de microalgas.',
      source: 'US EPA',
      source_url: 'https://comptox.epa.gov/dashboard/',
      last_reviewed: '2026-01-18',
    },
    {
      id: 'ing_0005',
      inci_name: 'Decyl Glucoside',
      synonyms: ['decil glucosido'],
      category: 'tensioactivo no iónico',
      water_impact_weight: 0.12,
      status: 'verified',
      justification: 'Derivado vegetal fácilmente biodegradable con mínima ecotoxicidad.',
      source: 'ECHA',
      source_url: 'https://echa.europa.eu/',
      last_reviewed: '2026-02-10',
    },
    {
      id: 'ing_0006',
      inci_name: 'Citric Acid',
      synonyms: ['acido citrico'],
      category: 'regulador de pH',
      water_impact_weight: 0.08,
      status: 'verified',
      justification: 'Se degrada rápidamente en cuerpos de agua sin efectos bioacumulativos.',
      source: 'CosIng',
      source_url: 'https://ec.europa.eu/growth/tools-databases/cosing/',
      last_reviewed: '2026-02-05',
    },
    {
      id: 'ing_0007',
      inci_name: 'Linear Alkylbenzene Sulfonate',
      synonyms: ['las', 'sulfonato de alquilbenceno lineal'],
      category: 'tensioactivo aniónico',
      water_impact_weight: 0.68,
      status: 'verified',
      justification:
        'Presenta toxicidad aguda para peces e invertebrados antes de su biodegradación aerobia completa.',
      source: 'ECHA',
      source_url: 'https://echa.europa.eu/',
      last_reviewed: '2026-01-25',
    },
    {
      id: 'ing_0009',
      inci_name: 'Glycerin',
      synonyms: ['glicerina'],
      category: 'humectante',
      water_impact_weight: 0.05,
      status: 'verified',
      justification:
        'Compuesto orgánico inocuo para la vida acuática y completamente biodegradable.',
      source: 'CosIng',
      source_url: 'https://ec.europa.eu/growth/tools-databases/cosing/',
      last_reviewed: '2026-02-11',
    },
    {
      id: 'ing_0010',
      inci_name: 'EDTA Tetrasodium',
      synonyms: ['edta'],
      category: 'quelante',
      water_impact_weight: 0.74,
      status: 'verified',
      justification:
        'Baja biodegradabilidad; puede movilizar metales pesados desde sedimentos fluviales.',
      source: 'ECHA',
      source_url: 'https://echa.europa.eu/',
      last_reviewed: '2026-02-01',
    },
    {
      id: 'ing_0099',
      inci_name: 'Caesalpinia Spinosa Gum',
      synonyms: ['goma de tara', 'tara gum'],
      category: 'espesante botánico local',
      water_impact_weight: null,
      status: 'insufficient_data',
      justification:
        'No se encontró evidencia ecotoxicológica estandarizada suficiente sobre su degradación en efluentes.',
      source: 'CosIng (Sin datos ecotox)',
      source_url: 'https://ec.europa.eu/growth/tools-databases/cosing/',
      last_reviewed: '2026-02-14',
    },
    {
      id: 'ing_0100',
      inci_name: 'Minthostachys Mollis Oil',
      synonyms: ['aceite esencial de muña', 'aceite esencial de muna'],
      category: 'activo botánico andino',
      water_impact_weight: null,
      status: 'insufficient_data',
      justification:
        'No se encontró evidencia suficiente sobre su impacto crónico en organismos acuáticos en ECHA o EPA.',
      source: 'Revisión Local',
      source_url: 'https://echa.europa.eu/',
      last_reviewed: '2026-02-14',
    },
  ];

  simulateScan(payload: ScanRequestPayload): ProductScanResult {
    const cleanText = payload.raw_ocr_text.replace(/^(ingredientes|ingredients)\s*:\s*/i, '');
    const tokens = cleanText
      .split(/[,;\n]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const verified: Ingredient[] = [];
    const insufficient: Ingredient[] = [];
    const unmatched: string[] = [];

    for (const token of tokens) {
      const norm = token
        .toLowerCase()
        .replace(/\([^)]*\)/g, '')
        .trim();
      if (['aqua', 'water', 'agua'].includes(norm)) continue;

      const found = this.db.find(
        (ing) =>
          norm.includes(ing.inci_name.toLowerCase()) ||
          ing.synonyms.some((s) => norm.includes(s.toLowerCase())),
      );

      if (found) {
        if (found.status === 'verified' && !verified.some((v) => v.id === found.id)) {
          verified.push(found);
        } else if (
          found.status === 'insufficient_data' &&
          !insufficient.some((i) => i.id === found.id)
        ) {
          insufficient.push(found);
        }
      } else {
        unmatched.push(token);
      }
    }

    // Regla 6.1 y 6.2: Exclusión de marca/precio y exclusión de insufficient_data
    const weights = verified.map((v) => v.water_impact_weight!).filter((w) => w !== null);
    const scoreNumeric = weights.length
      ? Number((weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(2))
      : null;

    let grade: WaterImpactGrade = 'N/A';
    if (scoreNumeric !== null) {
      if (scoreNumeric <= 0.2) grade = 'A';
      else if (scoreNumeric <= 0.4) grade = 'B';
      else if (scoreNumeric <= 0.6) grade = 'C';
      else if (scoreNumeric <= 0.8) grade = 'D';
      else grade = 'E';
    }

    const sentences: string[] = [];
    if (verified.length && scoreNumeric !== null) {
      const sorted = [...verified].sort(
        (a, b) => (b.water_impact_weight ?? 0) - (a.water_impact_weight ?? 0),
      );
      sentences.push(
        `Este producto obtiene una calificación ${grade} (índice ${scoreNumeric.toFixed(2)}) principalmente por contener ${sorted[0].inci_name} (${sorted[0].source}): ${sorted[0].justification.toLowerCase()}`,
      );
      if (sorted.length > 1) {
        sentences.push(
          `Asimismo, incorpora ${sorted[1].inci_name} (${sorted[1].source}): ${sorted[1].justification.toLowerCase()}`,
        );
      }
    }
    if (insufficient.length) {
      const names = insufficient.map((i) => i.inci_name).join(', ');
      sentences.push(
        `No se encontró evidencia suficiente sobre ${names}, por lo que se excluyó del cálculo numérico sin penalizar la fórmula.`,
      );
    }

    return {
      scan_id: 'scan_local_' + Math.random().toString(36).substring(2, 8),
      raw_ocr_text: payload.raw_ocr_text,
      matched_ingredients: verified.map((v) => v.id),
      unmatched_text_fragments: unmatched,
      insufficient_data_ingredients: insufficient.map((i) => i.id),
      water_impact_score: grade,
      score_numeric: scoreNumeric,
      explanation:
        sentences.slice(0, 3).join(' ') ||
        'Sin evidencia verificada suficiente para emitir calificación.',
      alternatives:
        grade === 'A' || grade === 'B'
          ? ['El producto ya pertenece al rango de bajo impacto hídrico (A-B).']
          : [
              'Fórmulas con tensioactivos glucosídicos (Decyl Glucoside) y ácido cítrico libres de fosfatos (STPP) y Triclosán.',
            ],
      timestamp: new Date().toISOString(),
      traceability_details: [...verified, ...insufficient],
    };
  }

  getAllIngredients(status?: string, search?: string): Ingredient[] {
    let list = [...this.db];
    if (status && status !== 'all') {
      list = list.filter((i) => i.status === status);
    }
    if (search?.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.inci_name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.synonyms.some((s) => s.toLowerCase().includes(q)),
      );
    }
    return list;
  }
}
