import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { goBack as navigateBack } from '../../shared/utils/navigation.util';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiConfiguration } from '../../../api/api-configuration';
import { reportsCustomerLedger } from '../../../api/fn/reports/reports-customer-ledger';
import { reportsHighRisk } from '../../../api/fn/reports/reports-high-risk';
import { reportsDailyCollection } from '../../../api/fn/reports/reports-daily-collection';
import { downloadBlob } from '../../shared/utils/download.util';
import { ToastService } from '../../core/services/toast.service';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private toast = inject(ToastService);
  private location = inject(Location);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  goBack(): void {
    navigateBack(this.location, this.router, '/dashboard');
  }

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
      this.toast.error('Please enter a Customer ID');
      return;
    }

    this.isLedgerLoading = true;
    reportsCustomerLedger(this.http, this.config.rootUrl, {
      customerId: this.ledgerForm.customerId,
      fromDate: this.ledgerForm.fromDate ? this.ledgerForm.fromDate.toISOString().split('T')[0] : null,
      toDate: this.ledgerForm.toDate ? this.ledgerForm.toDate.toISOString().split('T')[0] : null
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        downloadBlob(res.body, `Customer_Ledger_${this.ledgerForm.customerId}.pdf`);
        this.isLedgerLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error generating report');
        this.isLedgerLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  downloadHighRisk() {
    this.isHighRiskLoading = true;
    reportsHighRisk(this.http, this.config.rootUrl, {
      branchId: this.highRiskForm.branchId
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        downloadBlob(res.body, 'High_Risk_Defaulters.pdf');
        this.isHighRiskLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error generating report');
        this.isHighRiskLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  downloadDailyCollection() {
    if (!this.dailyCollectionForm.date) {
      this.toast.error('Please select a date');
      return;
    }

    this.isDailyCollectionLoading = true;
    reportsDailyCollection(this.http, this.config.rootUrl, {
      date: this.dailyCollectionForm.date.toISOString().split('T')[0],
      branchId: this.dailyCollectionForm.branchId
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        downloadBlob(res.body, `Daily_Collection_${this.dailyCollectionForm.date.toISOString().split('T')[0]}.pdf`);
        this.isDailyCollectionLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Error generating report');
        this.isDailyCollectionLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}

