import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomersListComponent } from './pages/customers/customers-list/customers-list.component';
import { CustomerCreateComponent } from './pages/customers/customer-create/customer-create.component';
import { CustomerDetailComponent } from './pages/customers/customer-detail/customer-detail.component';
import { LoansListComponent } from './pages/loans/loans-list/loans-list.component';
import { AuthGuard } from './core/guards/auth.guard';

import { CollectionRouteComponent } from './pages/collections/collection-route/collection-route.component';
import { CollectionVerifyComponent } from './pages/collections/collection-verify/collection-verify.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'customers', component: CustomersListComponent },
      { path: 'customers/new', component: CustomerCreateComponent },
      { path: 'customers/:id', component: CustomerDetailComponent },
      { path: 'loans', component: LoansListComponent },
      { path: 'collections/route', component: CollectionRouteComponent },
      { path: 'collections/verify', component: CollectionVerifyComponent },
      // { path: 'reports', component: ReportsComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

