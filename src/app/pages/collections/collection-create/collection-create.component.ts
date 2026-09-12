import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { collectionCreate } from '../../../../api/fn/collection/collection-create';
import { Loan } from '../../../../api/models/loan';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-collection-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './collection-create.component.html',
  styleUrls: ['./collection-create.component.css']
})
export class CollectionCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private toast = inject(ToastService);
  
  public dialogRef = inject(MatDialogRef<CollectionCreateComponent>);

  collectionForm!: FormGroup;
  isLoading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public loan: Loan) {}

  ngOnInit(): void {
    this.collectionForm = this.fb.group({
      amountPaid: [this.loan.dailyDueAmount, [Validators.required, Validators.min(1)]],
      paymentMode: [0, Validators.required], // 0: Cash, 1: UPI, 2: Bank, 3: Cheque
      remarks: ['']
    });
  }

  onSubmit() {
    if (this.collectionForm.invalid) return;

    this.isLoading = true;
    const formValue = this.collectionForm.value;

    collectionCreate(this.http, this.config.rootUrl, {
      body: {
        loanId: this.loan.loanId,
        customerId: this.loan.customerId,
        amountPaid: formValue.amountPaid,
        paymentMode: formValue.paymentMode,
        remarks: formValue.remarks
      }
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Collection recorded successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error creating collection', err);
        this.toast.error('Failed to record collection');
        this.isLoading = false;
      }
    });
  }
}
