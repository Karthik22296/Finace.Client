import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'customers', loadComponent: () => import('./pages/customers/customers-list/customers-list.component').then(m => m.CustomersListComponent) },
      { path: 'customers/new', loadComponent: () => import('./pages/customers/customer-create/customer-create.component').then(m => m.CustomerCreateComponent) },
      { path: 'customers/:id', loadComponent: () => import('./pages/customers/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent) },
      { path: 'loans', loadComponent: () => import('./pages/loans/loans-list/loans-list.component').then(m => m.LoansListComponent) },
      { path: 'collections/route', loadComponent: () => import('./pages/collections/collection-route/collection-route.component').then(m => m.CollectionRouteComponent) },
      { 
        path: 'collections/verify', 
        loadComponent: () => import('./pages/collections/collection-verify/collection-verify.component').then(m => m.CollectionVerifyComponent),
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
      },
      { 
        path: 'reports', 
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
