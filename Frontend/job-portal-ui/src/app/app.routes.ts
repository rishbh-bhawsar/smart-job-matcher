import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
    },
    {
        path: 'notifications',
        loadComponent: () =>
            import('./features/notifications/notifications').then(m => m.NotificationsComponent)
    },
    {
        path: 'profile',
        loadComponent: () =>
            import('./features/profile/profile').then(m => m.ProfileComponent)
    },
    { path: '**', redirectTo: 'dashboard' }
];