import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomersListComponent } from './pages/customers/customers-list/customers-list.component';
import { CustomerCreateComponent } from './pages/customers/customer-create/customer-create.component';
import { CustomerDetailComponent } from './pages/customers/customer-detail/customer-detail.component';
import { AuthGuard } from './core/guards/auth.guard';

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
      // { path: 'loans', component: LoansComponent },
      // { path: 'collections', component: CollectionsComponent },
      // { path: 'reports', component: ReportsComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

