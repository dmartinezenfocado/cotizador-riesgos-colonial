import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home primero
  {
    path: '',
    loadComponent: () =>
      import('./features/polizas/ui/home/home.component').then(m => m.HomeComponent)
  },

  // Rutas de pólizas (por ahora cargan páginas vacías standalone)
  {
    path: 'pol_incendio_lineas_aliadas',
    loadComponent: () =>
      import('./features/polizas/ui/pol_incendio_lineas_aliadas/pol_incendio_lineas_aliadas.page')
        .then(m => m.PolIncendioLineasAliadasPage)
  },
  {
    path: 'pol_interrupcion_americano',
    loadComponent: () =>
      import('./features/polizas/ui/pol_interrupcion_americano/pol_interrupcion_americano.page')
        .then(m => m.PolInterrupcionAmericanoPage)
  },
  {
    path: 'pol_interrupcion_ingles',
    loadComponent: () =>
      import('./features/polizas/ui/pol_interrupcion_ingles/pol_interrupcion_ingles.page')
        .then(m => m.PolInterrupcionInglesPage)
  },
  {
    path: 'pol_todo_riesgo_incendio',
    loadComponent: () =>
      import('./features/polizas/ui/pol_todo_riesgo_incendio/pol_todo_riesgo_incendio.page')
        .then(m => m.PolTodoRiesgoIncendioPage)
  },
  {
    path: 'pol_naves_maritimas',
    loadComponent: () =>
      import('./features/polizas/ui/pol_naves_maritimas/pol_naves_maritimas.page')
        .then(m => m.PolNavesMaritimasPage)
  },
  {
    path: 'pol_fidelidad_americano',
    loadComponent: () =>
      import('./features/polizas/ui/pol_fidelidad_americano/pol_fidelidad_americano.page')
        .then(m => m.PolFidelidadAmericanoPage)
  },
  {
    path: 'pol_fidelidad_ingles',
    loadComponent: () =>
      import('./features/polizas/ui/pol_fidelidad_ingles/pol_fidelidad_ingles.page')
        .then(m => m.PolFidelidadInglesPage)
  },
  {
    path: 'pol_todo_riesgo_equipo_contratista',
    loadComponent: () =>
      import('./features/polizas/ui/pol_todo_riesgo_equipo_contratista/pol_todo_riesgo_equipo_contratista.page')
        .then(m => m.PolTodoRiesgoEquipoContratistaPage)
  },
  {
    path: 'pol_todo_riesgo_equipo_electronico',
    loadComponent: () =>
      import('./features/polizas/ui/pol_todo_riesgo_equipo_electronico/pol_todo_riesgo_equipo_electronico.page')
        .then(m => m.PolTodoRiesgoEquipoElectronicoPage)
  },
/*
  // 404
  {
    path: '**',
    loadComponent: () =>
      import('./common/components/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }*/
];
