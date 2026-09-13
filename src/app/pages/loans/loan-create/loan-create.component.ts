import { Component, OnInit, inject, Optional, Inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { loanCreate } from '../../../../api/fn/loan/loan-create';
import { customerGetAll } from '../../../../api/fn/customer/customer-get-all';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { ToastService } from '../../../core/services/toast.service';
import { Customer } from '../../../../api/models/customer';

@Component({
  selector: 'app-loan-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.css']
})
export class LoanCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialogRef = inject(MatDialogRef<LoanCreateComponent>, { optional: true });
  private data = inject<{ customerId?: number } | null>(MAT_DIALOG_DATA, { optional: true });
  private toastService = inject(ToastService);
  private location = inject(Location);
  private router = inject(Router);

  isLoading = false;
  customers: Customer[] = [];
  dailyDueAmount = 0;

  // Format today as YYYY-MM-DD
  todayDate = new Date().toISOString().substring(0, 10);
  defaultLoanNumber = 'LN-' + Math.floor(1000 + Math.random() * 9000);

  loanForm = this.fb.group({
    customerId: [null as number | null, [Validators.required]],
    loanNumber: [this.defaultLoanNumber, [Validators.required]],
    loanAmount: [10000, [Validators.required, Validators.min(100)]],
    interestRate: [20, [Validators.required, Validators.min(0)]], // 20% flat interest default
    startDate: [this.todayDate, [Validators.required]]
  });

  ngOnInit() {
    this.loadActiveCustomers();

    if (this.data && this.data.customerId) {
      this.loanForm.patchValue({ customerId: this.data.customerId });
    }
    
    // Automatically calculate daily due amount when amount or interest changes
    this.loanForm.valueChanges.subscribe(() => {
      this.calculateDailyDue();
    });
    this.calculateDailyDue();
  }

  loadActiveCustomers() {
    customerGetAll(this.http, this.config.rootUrl, { isActive: true }).subscribe({
      next: async (response) => {
        try {
          const text = await response.body.text();
          this.customers = text ? JSON.parse(text) : [];
          if (this.data && this.data.customerId) {
            this.loanForm.patchValue({ customerId: this.data.customerId });
          }
        } catch (e) {
          console.error('Failed to parse customers', e);
        }
      },
      error: (err) => {
        console.error('Error loading customers', err);
      }
    });
  }

  calculateDailyDue() {
    const principal = Number(this.loanForm.get('loanAmount')?.value) || 0;
    const rate = Number(this.loanForm.get('interestRate')?.value) || 0;
    
    const totalRepayment = principal + (principal * (rate / 100));
    this.dailyDueAmount = totalRepayment / 100;
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.isLoading = true;
      const formValue = this.loanForm.value;

      const dateStr = formValue.startDate + 'T00:00:00Z';

      loanCreate(this.http, this.config.rootUrl, {
        body: {
          customerId: formValue.customerId!,
          loanNumber: formValue.loanNumber!,
          loanAmount: formValue.loanAmount!,
          dailyDueAmount: this.dailyDueAmount,
          startDate: dateStr
        }
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.success('Loan created successfully');
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['/loans']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error creating loan', err);
          this.toastService.error('Failed to create loan');
        }
      });
    }
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.location.back();
    }
  }
}

