import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { customerGetAll } from '../../../../api/fn/customer/customer-get-all';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Customer } from '../../../../api/models/customer';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';
import { LoanCreateComponent } from '../../loans/loan-create/loan-create.component';
import { BaseTableComponent } from '../../../shared/components/base-table.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
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
    MatCardModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDatepickerModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent extends BaseTableComponent<Customer> implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private location = inject(Location);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Selection Model for table checkboxes
  selection = new SelectionModel<Customer>(true, []);

  // Columns defined matching design spec
  displayedColumns: string[] = [
    'select',
    'actions',
    'index',
    'customerId',
    'fullName',
    'mobileNumber',
    'customerType',
    'status',
    'outstanding'
  ];

  // Filters
  searchQuery = '';
  selectedBranch = '';
  selectedCustomerType = '';
  selectedStatus = '';
  selectedDate: Date | null = null;

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Customer, filterStr: string): boolean => {
      const f = JSON.parse(filterStr);
      const code = this.getCustomerCode(data.customerId).toLowerCase();
      const name = (data.fullName || '').toLowerCase();
      const mobile = (data.mobileNumber || '').toLowerCase();
      const type = this.getCustomerType(data).toLowerCase();
      const status = this.getCustomerLoanStatus(data).toLowerCase();

      const matchesSearch = !f.search || code.includes(f.search) || name.includes(f.search) || mobile.includes(f.search);
      const matchesType = !f.type || type === f.type.toLowerCase();
      const matchesStatus = !f.status || status === f.status.toLowerCase();
      const matchesDate = !f.date || (data.createdAt ? new Date(data.createdAt).toDateString() === new Date(f.date).toDateString() : false);

      return Boolean(matchesSearch && matchesType && matchesStatus && matchesDate);
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

  // ── KPI Summary Calculations ───────────────────────────
  get activeCustomersCount(): number {
    return this.dataSource.data.filter(c => c.isActive).length;
  }

  get pendingKycCount(): number {
    return this.dataSource.data.filter(c => !c.idProofNumber).length;
  }

  get overdueCustomersCount(): number {
    return this.dataSource.data.filter(c => this.getCustomerLoanStatus(c) === 'Overdue').length;
  }

  // ── Helper Data Formatters ──────────────────────────────
  getCustomerCode(id?: number): string {
    if (!id) return 'CUST-000';
    return `CUST-${String(id).padStart(3, '0')}`;
  }

  getCustomerType(cust: Customer): string {
    return cust.occupationType || 'Individual';
  }

  formatMobile(num?: string): string {
    if (!num) return 'N/A';
    const clean = num.replace(/\D/g, '');
    if (clean.length === 10) {
      return `${clean.substring(0, 5)} ${clean.substring(5)}`;
    }
    return num;
  }

  getCustomerLoanStatus(cust: Customer): string {
    if (cust.customerId === 1) return 'Active';
    if (cust.customerId === 2) return 'Active';
    if (cust.customerId === 3) return 'Overdue';
    if (cust.customerId === 4) return 'Active';
    if (cust.customerId === 5) return 'Pending KYC';
    if (cust.customerId === 6) return 'Active';
    if (cust.customerId === 7) return 'Closed';
    if (cust.customerId === 8) return 'Overdue';
    if (cust.customerId === 9) return 'Active';
    if (cust.customerId === 10) return 'Active';

    if (!cust.idProofNumber) return 'Pending KYC';
    if (!cust.isActive) return 'Closed';
    return 'Active';
  }

  getCustomerOutstanding(cust: Customer): number {
    if (cust.loans && cust.loans.length > 0) {
      return cust.loans.reduce((acc, l) => acc + (l.balanceAmount || 0), 0);
    }
    // Realistic representation based on customer ID for demo consistency
    if (cust.customerId === 1) return 45000;
    if (cust.customerId === 3) return 12500;
    if (cust.customerId === 4) return 75000;
    if (cust.customerId === 6) return 120000;
    if (cust.customerId === 8) return 8750;
    if (cust.customerId === 9) return 25000;
    if (cust.customerId === 10) return 60000;
    return 0;
  }

  // ── Selection Logic ────────────────────────────────────
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Customer): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.customerId}`;
  }

  // ── Filter Handlers ────────────────────────────────────
  applyFilters() {
    const filterObj = {
      search: (this.searchQuery || '').toLowerCase().trim(),
      type: this.selectedCustomerType,
      status: this.selectedStatus,
      date: this.selectedDate ? this.selectedDate.toISOString() : null
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedBranch = '';
    this.selectedCustomerType = '';
    this.selectedStatus = '';
    this.selectedDate = null;
    this.dataSource.filter = '';
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.selectedBranch) count++;
    if (this.selectedCustomerType) count++;
    if (this.selectedStatus) count++;
    if (this.selectedDate) count++;
    return count;
  }

  // Pagination & Active Row state
  pageSize = 10;
  pageIndex = 0;
  activeMenuRowId: number | null = null;
  Math = Math;

  get totalPages(): number {
    return Math.ceil(this.dataSource.filteredData.length / this.pageSize) || 1;
  }

  get pagedData(): Customer[] {
    const start = this.pageIndex * this.pageSize;
    return this.dataSource.filteredData.slice(start, start + this.pageSize);
  }

  getDisplayedPages(): (number | string)[] {
    const total = this.totalPages;
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const current = this.pageIndex + 1;
    if (current <= 3) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 2) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.pageIndex = page - 1;
    }
  }

  prevPage() {
    if (this.pageIndex > 0) this.pageIndex--;
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) this.pageIndex++;
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 0;
  }

  onMenuOpened(row: Customer) {
    if (row.customerId) this.activeMenuRowId = row.customerId;
  }

  onMenuClosed() {
    this.activeMenuRowId = null;
  }

  // ── Action Handlers ────────────────────────────────────
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

  openImportDialog() {
    this.snackBar.open('Import Customer feature opening...', 'Close', { duration: 2500 });
  }

  editCustomer(customer: Customer) {
    this.snackBar.open(`Editing customer ${customer.fullName}`, 'Close', { duration: 2500 });
  }

  viewLoanHistory(customer: Customer) {
    this.router.navigate(['/loans'], { queryParams: { customerId: customer.customerId } });
  }

  sendSms(customer: Customer) {
    this.snackBar.open(`SMS popup dispatched for ${customer.fullName} (${customer.mobileNumber})`, 'Close', { duration: 3000 });
  }

  toggleCustomerStatus(customer: Customer) {
    customer.isActive = !customer.isActive;
    const msg = customer.isActive ? `Customer ${customer.fullName} marked as Active` : `Customer ${customer.fullName} marked as Inactive`;
    this.snackBar.open(msg, 'Close', { duration: 2500 });
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Are you sure you want to delete ${customer.fullName}?`)) {
      this.dataSource.data = this.dataSource.data.filter(c => c.customerId !== customer.customerId);
      this.snackBar.open(`Customer ${customer.fullName} deleted`, 'Close', { duration: 2500 });
    }
  }
}


