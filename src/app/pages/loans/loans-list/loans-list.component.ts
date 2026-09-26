import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { goBack as navigateBack } from '../../../shared/utils/navigation.util';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { loanGetAll } from '../../../../api/fn/loan/loan-get-all';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Loan } from '../../../../api/models/loan';
import { BaseTableComponent } from '../../../shared/components/base-table.component';
import { parseBlobJson } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-loans-list',
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
    MatDialogModule,
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule
  ],
  templateUrl: './loans-list.component.html',
  styleUrls: ['./loans-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoansListComponent extends BaseTableComponent<Loan> implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialog = inject(MatDialog);
  private location = inject(Location);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  goBack(): void {
    navigateBack(this.location, this.router, '/dashboard');
  }

  displayedColumns: string[] = ['loanNumber', 'customerName', 'loanAmount', 'balanceAmount', 'startDate', 'status', 'actions'];
  filterColumns: string[] = ['loanNumberFilter', 'customerNameFilter', 'loanAmountFilter', 'balanceAmountFilter', 'startDateFilter', 'statusFilter', 'actionsFilter'];

  override filterValues = {
    loanNumber: '',
    customerName: ''
  };

  ngOnInit(): void {
    // Custom filter predicate for multi-column search
    this.dataSource.filterPredicate = (data: Loan, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const customerName = data.customer?.fullName || '';
      return (data.loanNumber || '').toLowerCase().includes(searchTerms.loanNumber)
          && customerName.toLowerCase().includes(searchTerms.customerName);
    };
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'customerName': return item.customer?.fullName?.toLowerCase() || '';
        case 'status': return item.isClosed ? 1 : 0;
        default: return (item as unknown as Record<string, unknown>)[property] as string | number;
      }
    };
    this.loadLoans();
  }

  loadLoans() {
    this.startLoading();
    loanGetAll(this.http, this.config.rootUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (response) => {
          this.dataSource.data = await parseBlobJson<Loan[]>(response.body, []);
          this.isLoading = false;
          this.clearError();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.setError(err, 'Failed to load loan records. Please verify your connection.');
          this.cdr.markForCheck();
        }
      });
  }

  async openCreateLoanDialog() {
    const { LoanCreateComponent } = await import('../loan-create/loan-create.component');
    const dialogRef = this.dialog.open(LoanCreateComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result === true) {
        this.loadLoans();
      }
    });
  }
}
