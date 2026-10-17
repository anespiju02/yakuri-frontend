import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'presentacion',
  },
  {
    path: 'presentacion',
    title: 'Yakuri — Presentación y Arquitectura Ética',
    loadComponent: () =>
      import('./features/presentation/pages/presentation-page.component/presentation-page.component').then(
        (m) => m.PresentationPageComponent,
      ),
  },
  {
    path: 'escaner',
    title: 'Yakuri — Escáner de Impacto Hídrico A-E',
    loadComponent: () =>
      import('./features/scanner/pages/scanner-page.component/scanner-page.component').then(
        (m) => m.ScannerPageComponent,
      ),
  },
  {
    path: 'auditoria-etica',
    title: 'Yakuri — Prueba de Sustitución de Marca (6.3)',
    loadComponent: () =>
      import('./features/ethics-audit/pages/audit-page.component/audit-page.component').then(
        (m) => m.AuditPageComponent,
      ),
  },
  {
    path: 'base-cientifica',
    title: 'Yakuri — Base Científica de Ingredientes',
    loadComponent: () =>
      import('./features/ingredients-db/pages/ingredients-page.component/ingredients-page.component').then(
        (m) => m.IngredientsPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'presentacion',
  },
];
