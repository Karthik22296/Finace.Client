import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/auth/auth.guard';

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
      // Placeholder for future modules
      // { path: 'dashboard', component: DashboardComponent },
      // { path: 'customers', component: CustomersComponent },
      // { path: 'loans', component: LoansComponent },
      // { path: 'collections', component: CollectionsComponent },
      // { path: 'reports', component: ReportsComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
