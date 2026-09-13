import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['customerCode', 'fullName', 'mobileNumber', 'isActive', 'actions'];
  filterColumns: string[] = ['customerCodeFilter', 'fullNameFilter', 'mobileNumberFilter', 'isActiveFilter', 'actionsFilter'];

  override filterValues = {
    customerCode: '',
    fullName: '',
    mobileNumber: ''
  };

  ngOnInit(): void {
    // Custom filter predicate for multi-column search
    this.dataSource.filterPredicate = (data: Customer, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (data.customerCode || '').toLowerCase().includes(searchTerms.customerCode)
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
        // Refresh the list if a new customer was successfully created
        this.loadCustomers();
      }
    });
  }
}
