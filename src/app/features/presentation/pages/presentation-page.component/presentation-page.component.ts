import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PipelineNode {
  step: number;
  title: string;
  subtitle: string;
  tech: string;
  description: string;
  inputSample: string;
  outputSample: string;
  ethicalControl: string;
}

@Component({
  selector: 'app-presentation-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './presentation-page.component.html',
})
export class PresentationPageComponent {
  readonly pipelineNodes: PipelineNode[] = [
    {
      step: 1,
      title: 'Captura de Etiqueta',
      subtitle: 'Fotografía del usuario',
      tech: 'Cámara Web / Móvil',
      description:
        'El usuario fotografía la lista de ingredientes (INCI o español) del producto de limpieza o cuidado personal.',
      inputSample: 'Imagen de etiqueta trasera de detergente o lavavajillas',
      outputSample: 'Frame de imagen preprocesado sin metadatos de marca frontal',
      ethicalControl: 'Omitir logotipos comerciales para evitar sesgo visual.',
    },
    {
      step: 2,
      title: 'Extracción OCR',
      subtitle: 'Visión por computadora',
      tech: 'Tesseract / Cloud Vision',
      description:
        'Convierte la fotografía de la etiqueta en una cadena de texto crudo con los fragmentos de ingredientes.',
      inputSample: 'Imagen binaria de etiqueta',
      outputSample: '"Ingredientes: Aqua, S0dium Laur3th Sulfat3, Triclosan, Goma de Tara"',
      ethicalControl: 'Extracción exclusiva del bloque de composición química.',
    },
    {
      step: 3,
      title: 'Normalización PLN',
      subtitle: 'Similitud semántica',
      tech: 'RapidFuzz / Embeddings',
      description:
        'Tolera errores tipográficos del OCR y empareja sinónimos locales contra nombres INCI estandarizados.',
      inputSample: '"S0dium Laur3th Sulfat3, Goma de Tara"',
      outputSample: 'matched: ["ing_0001"], insufficient: ["ing_0099"]',
      ethicalControl: 'Separación estricta entre verificados e insufficient_data (6.2).',
    },
    {
      step: 4,
      title: 'Motor de Puntaje',
      subtitle: 'Reglas científicas',
      tech: 'Python Scoring Engine',
      description:
        'Calcula el promedio de water_impact_weight (0 a 1) únicamente sobre los ingredientes verificados.',
      inputSample: 'ing_0001 (0.60), ing_0002 (0.95) | ing_0099 (null -> excluido)',
      outputSample: 'score_numeric = 0.78',
      ethicalControl: 'Firma aislada de marca, precio o patrocinio comercial (6.1).',
    },
    {
      step: 5,
      title: 'Índice Hídrico A–E',
      subtitle: 'Semáforo ambiental',
      tech: 'Escala A (0.0-0.2) a E (0.81-1.0)',
      description:
        'Traduce el valor numérico en una categoría comprensible A–E para el ciudadano de Lima Metropolitana.',
      inputSample: 'score_numeric = 0.78',
      outputSample: 'water_impact_score = "D" (Impacto Alto-Moderado)',
      ethicalControl: 'Umbrales transparentes y auditables por comité asesor.',
    },
    {
      step: 6,
      title: 'Explicación RAG',
      subtitle: 'LLM restringido',
      tech: 'Prompt Grounded RAG',
      description:
        'Redacta máximo 3 oraciones en español claro usando únicamente las justificaciones oficiales de la base.',
      inputSample: 'Justificaciones ECHA/EPA + lista insufficient_data',
      outputSample:
        '"Obtiene D (0.78) por Triclosan (US EPA)... No hay evidencia suficiente sobre Goma de Tara..."',
      ethicalControl:
        'Prohibición de inventar cifras o asumir impacto en datos faltantes (Sección 5).',
    },
    {
      step: 7,
      title: 'Trazabilidad y Alternativas',
      subtitle: 'Vista al ciudadano',
      tech: 'Angular 22 UI',
      description:
        'Muestra el desglose con fuentes y fechas de revisión junto con recomendaciones genéricas libres de marcas patrocinadas.',
      inputSample: 'ProductScanResponse JSON',
      outputSample: 'Tarjetas con links ECHA/EPA/CosIng + Alternativas por tipo químico',
      ethicalControl: 'Trazabilidad 6.4 completa y recomendaciones no comerciales.',
    },
  ];

  readonly selectedNode = signal<PipelineNode>(this.pipelineNodes[3]);
}
