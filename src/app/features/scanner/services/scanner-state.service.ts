import { Injectable, inject, signal, computed } from '@angular/core';
import { YakuriApiService } from '../../../core/services/yakuri-api.service';
import { ProductScanResult } from '../../../core/models/product-scan.model';
import { finalize } from 'rxjs';

@Injectable() // Scoped al módulo scanner
export class ScannerStateService {
  private readonly api = inject(YakuriApiService);

  // Signals de entrada
  readonly rawOcrText = signal<string>(
    'Ingredientes: Aqua, Sodium Laureth Sulfate (SLES), Cocamidopropyl Betaine, Triclosan, Citric Acid',
  );
  readonly brandIgnored = signal<string>('Marca Comercial Demo');
  readonly priceIgnored = signal<number>(18.9);

  // Signals de resultado y carga
  readonly loading = signal<boolean>(false);
  readonly currentResult = signal<ProductScanResult | null>(null);

  // Selectores derivados (computed)
  readonly verifiedCount = computed(() => this.currentResult()?.matched_ingredients.length ?? 0);
  readonly insufficientCount = computed(
    () => this.currentResult()?.insufficient_data_ingredients.length ?? 0,
  );

  analyzeCurrentText(): void {
    if (!this.rawOcrText().trim()) return;
    this.loading.set(true);

    this.api
      .scanLabel({
        raw_ocr_text: this.rawOcrText(),
        brand_ignored: this.brandIgnored(),
        price_pen_ignored: this.priceIgnored(),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => this.currentResult.set(res),
        error: (err) => console.error('Error al invocar /api/v1/scan:', err),
      });
  }
}
