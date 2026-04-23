import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'owner', pathMatch: 'full' },
    {
        path: 'owner',
        loadComponent: () => import('./pages/owner/owner.component').then(m => m.OwnerComponent)
    },
    {
        path: 'vehicle',
        loadComponent: () => import('./pages/vehicle/vehicle.component').then(m => m.VehicleComponent)
    }
];
