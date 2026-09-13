import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiConfiguration } from '../../../api/api-configuration';
import { reportsCustomerLedger } from '../../../api/fn/reports/reports-customer-ledger';
import { reportsHighRisk } from '../../../api/fn/reports/reports-high-risk';
import { reportsDailyCollection } from '../../../api/fn/reports/reports-daily-collection';
import { downloadBlob } from '../../shared/utils/download.util';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private snackBar = inject(MatSnackBar);

  // States
  isLedgerLoading = false;
  isHighRiskLoading = false;
  isDailyCollectionLoading = false;

  // Form Models
  ledgerForm = {
    customerId: null as number | null,
    fromDate: null as Date | null,
    toDate: null as Date | null
  };

  dailyCollectionForm = {
    date: new Date(),
    branchId: null as number | null
  };

  highRiskForm = {
    branchId: null as number | null
  };

  downloadCustomerLedger() {
    if (!this.ledgerForm.customerId) {
      this.snackBar.open('Please enter a Customer ID', 'Close', { duration: 3000 });
      return;
    }

    this.isLedgerLoading = true;
    reportsCustomerLedger(this.http, this.config.rootUrl, {
      customerId: this.ledgerForm.customerId,
      fromDate: this.ledgerForm.fromDate ? this.ledgerForm.fromDate.toISOString().split('T')[0] : null,
      toDate: this.ledgerForm.toDate ? this.ledgerForm.toDate.toISOString().split('T')[0] : null
    }).subscribe({
      next: (res) => {
        downloadBlob(res.body, `Customer_Ledger_${this.ledgerForm.customerId}.pdf`);
        this.isLedgerLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error generating report', 'Close', { duration: 3000 });
        this.isLedgerLoading = false;
      }
    });
  }

  downloadHighRisk() {
    this.isHighRiskLoading = true;
    reportsHighRisk(this.http, this.config.rootUrl, {
      branchId: this.highRiskForm.branchId
    }).subscribe({
      next: (res) => {
        downloadBlob(res.body, 'High_Risk_Defaulters.pdf');
        this.isHighRiskLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error generating report', 'Close', { duration: 3000 });
        this.isHighRiskLoading = false;
      }
    });
  }

  downloadDailyCollection() {
    if (!this.dailyCollectionForm.date) {
      this.snackBar.open('Please select a date', 'Close', { duration: 3000 });
      return;
    }

    this.isDailyCollectionLoading = true;
    reportsDailyCollection(this.http, this.config.rootUrl, {
      date: this.dailyCollectionForm.date.toISOString().split('T')[0],
      branchId: this.dailyCollectionForm.branchId
    }).subscribe({
      next: (res) => {
        downloadBlob(res.body, `Daily_Collection_${this.dailyCollectionForm.date.toISOString().split('T')[0]}.pdf`);
        this.isDailyCollectionLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error generating report', 'Close', { duration: 3000 });
        this.isDailyCollectionLoading = false;
      }
    });
  }
}
