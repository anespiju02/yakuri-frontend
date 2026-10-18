export interface AuditFormulaFixture {
  product_type: string;
  ocr_text: string;
}

export interface AuditBrandFixture {
  brand: string;
  price: number;
}

// Debe reflejar exactamente las fórmulas y marcas usadas en yakuri-backend/app/routers/auditorias_eticas.py. Si cambian allá, actualizar aquí.
export const AUDIT_FORMULAS: AuditFormulaFixture[] = [
  {
    product_type: 'Detergente en Polvo (Fosfatos + LAS)',
    ocr_text:
      'Ingredientes: Linear Alkylbenzene Sulfonate, Sodium Tripolyphosphate, EDTA Tetrasodium, Citric Acid',
  },
  {
    product_type: 'Lavavajillas Ecológico Local (Con Tara y Muña)',
    ocr_text:
      'Ingredientes: Decyl Glucoside, Glycerin, Citric Acid, Goma de Tara, Aceite esencial de Muña',
  },
  {
    product_type: 'Jabón Líquido Antibacterial (Con Triclosán)',
    ocr_text:
      'Ingredientes: Sodium Laureth Sulfate, Cocamidopropyl Betaine, Triclosan, Glycerin',
  },
];

export const AUDIT_BRANDS: AuditBrandFixture[] = [
  { brand: 'Marca Líder Global Premium', price: 45.9 },
  { brand: 'Marca Económica Supermercado', price: 6.5 },
  { brand: 'EcoEmprendimiento Local Lima', price: 18.0 },
  { brand: 'Marca Genérica Sin Nombre', price: 3.2 },
];
