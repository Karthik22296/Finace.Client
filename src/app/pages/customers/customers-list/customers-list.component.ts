import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { customerGetAll } from '../../../../api/fn/customer/customer-get-all';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Customer } from '../../../../api/models/customer';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';
import { LoanCreateComponent } from '../../loans/loan-create/loan-create.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { BaseTableComponent } from '../../../shared/components/base-table.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule
  ],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent extends BaseTableComponent<Customer> implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private location = inject(Location);
  private router = inject(Router);

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['customerId', 'fullName', 'mobileNumber', 'isActive', 'actions'];
  filterColumns: string[] = ['customerIdFilter', 'fullNameFilter', 'mobileNumberFilter', 'isActiveFilter', 'actionsFilter'];

  override filterValues = {
    customerId: '',
    fullName: '',
    mobileNumber: ''
  };

  ngOnInit(): void {
    // Custom filter predicate for multi-column search
    this.dataSource.filterPredicate = (data: Customer, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (data.customerId?.toString() || '').toLowerCase().includes(searchTerms.customerId)
          && (data.fullName || '').toLowerCase().includes(searchTerms.fullName)
          && (data.mobileNumber || '').toLowerCase().includes(searchTerms.mobileNumber);
    };
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    customerGetAll(this.http, this.config.rootUrl).subscribe({
      next: async (response) => {
        try {
          const text = await response.body.text();
          const customers: Customer[] = text ? JSON.parse(text) : [];
          this.dataSource.data = customers;
        } catch (e) {
          console.error('Failed to parse customers', e);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading customers', err);
        this.isLoading = false;
      }
    });
  }

  openCreateCustomerDialog() {
    const dialogRef = this.dialog.open(CustomerCreateComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadCustomers();
      }
    });
  }

  openCreateLoanForCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(LoanCreateComponent, {
      width: '600px',
      disableClose: true,
      data: { customerId: customer.customerId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(['/loans']);
      }
    });
  }
}

