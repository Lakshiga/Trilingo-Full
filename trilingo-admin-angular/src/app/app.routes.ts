import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'levels',
    loadComponent: () => import('./components/levels/levels.component').then(m => m.LevelsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'lessons',
    loadComponent: () => import('./components/lessons/lessons.component').then(m => m.LessonsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'main-activities',
    loadComponent: () => import('./components/main-activities/main-activities.component').then(m => m.MainActivitiesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'activity-types',
    loadComponent: () => import('./components/activity-types/activity-types.component').then(m => m.ActivityTypesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'games',
    loadComponent: () => import('./components/games/games.component').then(m => m.GamesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'activities',
    loadComponent: () => import('./pages/activities-list/activities-list.component').then(m => m.ActivitiesListPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'activity-edit',
    loadComponent: () => import('./pages/activity-editor/activity-editor.component').then(m => m.ActivityEditorPageComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'exercises',
    loadComponent: () => import('./pages/exercises-list/exercises-list.component').then(m => m.ExercisesListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];