import { Component, computed, input } from '@angular/core';
import { WaterImpactGrade } from '../../../../core/models/product-scan.model';

@Component({
  selector: 'app-score-badge',
  standalone: true,
  templateUrl: './score-badge.component.html',
})
export class ScoreBadgeComponent {
  readonly grade = input.required<WaterImpactGrade>();
  readonly scoreNumeric = input<number | null>(null);

  readonly badgeClasses = computed(() => {
    const map: Record<WaterImpactGrade, string> = {
      A: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300',
      B: 'bg-lime-500/20 border-lime-400/50 text-lime-300',
      C: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
      D: 'bg-orange-500/20 border-orange-400/50 text-orange-300',
      E: 'bg-rose-500/20 border-rose-400/50 text-rose-300',
      'N/A': 'bg-slate-700/40 border-slate-600 text-slate-300',
    };
    return map[this.grade()];
  });
}
