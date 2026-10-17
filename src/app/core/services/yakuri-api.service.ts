import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, of, map } from 'rxjs';
import {
  IngredientesApiService,
  EscaneosApiService,
  AuditoriasEticasApiService,
  SistemaApiService,
} from '../api/yakuri-backend';
import { Ingredient, IngredientStatus } from '../models/ingredient.model';
import { ProductScanResult, ScanRequestPayload } from '../models/product-scan.model';

@Injectable({ providedIn: 'root' })
export class YakuriApiService {
  // Inyectamos los servicios autogenerados por OpenAPI Generator
  private readonly sistemaApi = inject(SistemaApiService);
  private readonly ingredientesApi = inject(IngredientesApiService);
  private readonly escaneosApi = inject(EscaneosApiService);
  private readonly auditoriasApi = inject(AuditoriasEticasApiService);

  /** Signal reactivo que actualiza el badge de la barra superior */
  readonly backendOnline = signal<boolean>(false);

  checkHealth(): Observable<{ status: string }> {
    return this.sistemaApi.verificarEstadoApi().pipe(
      tap(() => this.backendOnline.set(true)),
      map((res: any) => ({ status: res?.status ?? 'ok' })),
      catchError(() => {
        this.backendOnline.set(false);
        return of({ status: 'offline' });
      }),
    );
  }

  getIngredients(status?: string, search?: string): Observable<Ingredient[]> {
    const estadoParam: IngredientStatus | undefined =
      status === 'verified' || status === 'insufficient_data' ? status : undefined;

    return this.ingredientesApi
      .listarIngredientes({
        estado: estadoParam,
        busqueda: search?.trim() ? search.trim() : undefined,
      })
      .pipe(
        tap(() => this.backendOnline.set(true)),
        map((items) => items as unknown as Ingredient[]),
      );
  }

  scanLabel(payload: ScanRequestPayload): Observable<ProductScanResult> {
    return this.escaneosApi
      .escanearEtiquetaTexto({
        solicitudEscaneoTexto: {
          raw_ocr_text: payload.raw_ocr_text,
          product_name: payload.product_name ?? null,
          brand_ignored: payload.brand_ignored ?? null,
          price_pen_ignored: payload.price_pen_ignored ?? null,
        },
      })
      .pipe(
        tap(() => this.backendOnline.set(true)),
        map((res) => res as unknown as ProductScanResult),
      );
  }

  scanLabelImage(
    file: File,
    brandIgnored?: string,
    priceIgnored?: number,
  ): Observable<ProductScanResult> {
    return this.escaneosApi
      .escanearEtiquetaImagen({
        archivo: file,
        brandIgnored: brandIgnored ?? null,
        pricePenIgnored: priceIgnored ?? null,
      })
      .pipe(
        tap(() => this.backendOnline.set(true)),
        map((res) => res as unknown as ProductScanResult),
      );
  }

  runBrandSubstitutionAudit(): Observable<any> {
    return this.auditoriasApi
      .ejecutarPruebaSustitucionMarca()
      .pipe(tap(() => this.backendOnline.set(true)));
  }
}
