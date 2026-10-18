import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { ScoreBadgeComponent } from '../../../../shared/components/score-badge/score-badge.component/score-badge.component';
import { YakuriApiService } from '../../../../core/services/yakuri-api.service';
import { LocalEthicsFallbackService } from '../../../../core/services/local-ethics-fallback.service';
import { ProductScanResult } from '../../../../core/models/product-scan.model';

interface PresetSample {
  label: string;
  brand: string;
  price: number;
  ocrText: string;
  highlightRule: string;
}

@Component({
  selector: 'app-scanner-page',
  standalone: true,
  imports: [FormsModule, ScoreBadgeComponent],
  templateUrl: './scanner-page.component.html',
})
export class ScannerPageComponent implements OnInit {
  private readonly api = inject(YakuriApiService);
  private readonly fallback = inject(LocalEthicsFallbackService);

  readonly presets: PresetSample[] = [
    {
      label: '1. Lavavajillas EcoAndino (Prueba Regla 6.2)',
      brand: 'EcoAndino Perú',
      price: 16.5,
      ocrText:
        'Ingredientes: Aqua, Decyl Glucoside, Glycerin, Citric Acid, Goma de Tara, Aceite esencial de Muña',
      highlightRule: 'Regla 6.2',
    },
    {
      label: '2. Jabón Antibacterial (Impacto D/E)',
      brand: 'Dermaclean Pro',
      price: 12.9,
      ocrText:
        'Ingredientes: Aqua, Sodium Laureth Sulfate (SLES), Cocamidopropyl Betaine, Triclosan, Citric Acid',
      highlightRule: 'Regla 6.1',
    },
    {
      label: '3. Detergente Industrial con Fosfatos',
      brand: 'UltraBlanc Max',
      price: 8.5,
      ocrText:
        'Ingredientes: Linear Alkylbenzene Sulfonate, Sodium Tripolyphosphate (STPP), EDTA Tetrasodium',
      highlightRule: 'Impacto alto verificado',
    },
  ];

  rawOcrText = this.presets[0].ocrText;
  brandIgnored = this.presets[0].brand;
  priceIgnored = this.presets[0].price;

  readonly loading = signal<boolean>(false);
  readonly scanResult = signal<ProductScanResult | null>(null);
  readonly usingLocalFallback = signal<boolean>(false);

  ngOnInit(): void {
    this.runScan();
  }

  loadPreset(sample: PresetSample): void {
    this.rawOcrText = sample.ocrText;
    this.brandIgnored = sample.brand;
    this.priceIgnored = sample.price;
    this.runScan();
  }

  runScan(): void {
    this.loading.set(true);
    this.usingLocalFallback.set(false);
    const payload = {
      raw_ocr_text: this.rawOcrText,
      brand_ignored: this.brandIgnored,
      price_pen_ignored: this.priceIgnored,
    };

    this.api
      .scanLabel(payload)
      .pipe(
        catchError(() => {
          this.usingLocalFallback.set(true);
          return of(this.fallback.simulateScan(payload));
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => this.scanResult.set(res));
  }
}
