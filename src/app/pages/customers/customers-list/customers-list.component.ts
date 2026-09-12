import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { customerGetAll } from '../../../../api/fn/customer/customer-get-all';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Customer } from '../../../../api/models/customer';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';

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
    MatDialogModule
  ],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['customerCode', 'fullName', 'mobileNumber', 'isActive', 'actions'];
  filterColumns: string[] = ['customerCodeFilter', 'fullNameFilter', 'mobileNumberFilter', 'isActiveFilter', 'actionsFilter'];
  dataSource = new MatTableDataSource<Customer>();
  isLoading = true;

  filterValues = {
    customerCode: '',
    fullName: '',
    mobileNumber: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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

  applyFilter(column: 'customerCode' | 'fullName' | 'mobileNumber', event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues[column] = filterValue.trim().toLowerCase();
    
    // Assigning a stringified JSON object to dataSource.filter triggers the filterPredicate
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
