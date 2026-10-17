import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { YakuriApiService } from '../../../../core/services/yakuri-api.service';
import { LocalEthicsFallbackService } from '../../../../core/services/local-ethics-fallback.service';
import { Ingredient } from '../../../../core/models/ingredient.model';

@Component({
  selector: 'app-ingredients-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingredients-page.component.html',
})
export class IngredientsPageComponent implements OnInit {
  private readonly api = inject(YakuriApiService);
  private readonly fallback = inject(LocalEthicsFallbackService);

  readonly statusFilters = [
    { label: 'Todos', value: 'all' },
    { label: 'Verificados (ECHA/EPA/CosIng)', value: 'verified' },
    { label: 'Evidencia Insuficiente (Regla 6.2)', value: 'insufficient_data' },
  ];

  searchQuery = '';
  readonly selectedStatus = signal<string>('all');
  readonly loading = signal<boolean>(false);
  readonly ingredients = signal<Ingredient[]>([]);

  readonly verifiedCount = computed(
    () => this.ingredients().filter((i) => i.status === 'verified').length,
  );
  readonly insufficientCount = computed(
    () => this.ingredients().filter((i) => i.status === 'insufficient_data').length,
  );

  ngOnInit(): void {
    this.loadIngredients();
  }

  setFilter(status: string): void {
    this.selectedStatus.set(status);
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.loading.set(true);
    const status = this.selectedStatus();
    const query = this.searchQuery;

    this.api
      .getIngredients(status, query)
      .pipe(
        catchError(() => of(this.fallback.getAllIngredients(status, query))),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((list) => this.ingredients.set(list));
  }

  getWeightBadgeClass(weight: number): string {
    if (weight <= 0.2) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
    if (weight <= 0.4) return 'bg-lime-500/20 border-lime-500/40 text-lime-300';
    if (weight <= 0.6) return 'bg-amber-500/20 border-amber-500/40 text-amber-300';
    if (weight <= 0.8) return 'bg-orange-500/20 border-orange-500/40 text-orange-300';
    return 'bg-rose-500/20 border-rose-500/40 text-rose-300';
  }
}
