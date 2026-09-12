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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { loanGetAll } from '../../../../api/fn/loan/loan-get-all';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Loan } from '../../../../api/models/loan';
import { LoanCreateComponent } from '../loan-create/loan-create.component';
import { BaseTableComponent } from '../../../shared/components/base-table.component';

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
    MatDialogModule
  ],
  templateUrl: './loans-list.component.html',
  styleUrls: ['./loans-list.component.css']
})
export class LoansListComponent extends BaseTableComponent<Loan> implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialog = inject(MatDialog);

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
    this.loadLoans();
  }

  loadLoans() {
    this.isLoading = true;
    loanGetAll(this.http, this.config.rootUrl).subscribe({
      next: async (response) => {
        try {
          const text = await response.body.text();
          const loans: Loan[] = text ? JSON.parse(text) : [];
          this.dataSource.data = loans;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } catch (e) {
          console.error('Failed to parse loans', e);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading loans', err);
        this.isLoading = false;
      }
    });
  }

  openCreateLoanDialog() {
    const dialogRef = this.dialog.open(LoanCreateComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Refresh the list if a new loan was successfully created
        this.loadLoans();
      }
    });
  }
}
