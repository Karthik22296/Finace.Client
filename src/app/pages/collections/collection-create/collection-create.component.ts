import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { collectionCreate } from '../../../../api/fn/collection/collection-create';
import { Loan } from '../../../../api/models/loan';
import { PaymentMode } from '../../../../api/models/payment-mode';
import { ToastService } from '../../../core/services/toast.service';
import { MatIconModule } from '@angular/material/icon';

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
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './collection-create.component.html',
  styleUrls: ['./collection-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionCreateComponent implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  
  public dialogRef = inject(MatDialogRef<CollectionCreateComponent>);
  public loan = inject<Loan>(MAT_DIALOG_DATA);

  collectionForm = new FormGroup<{
    amountPaid: FormControl<number>;
    paymentMode: FormControl<PaymentMode>;
    remarks: FormControl<string>;
  }>({
    amountPaid: new FormControl<number>(this.loan?.dailyDueAmount || 0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    paymentMode: new FormControl<PaymentMode>(0, { nonNullable: true, validators: [Validators.required] }),
    remarks: new FormControl<string>('', { nonNullable: true })
  });

  isLoading = false;

  ngOnInit(): void {}

  onSubmit() {
    if (this.collectionForm.invalid) return;

    this.isLoading = true;
    const formValue = this.collectionForm.getRawValue();

    collectionCreate(this.http, this.config.rootUrl, {
      body: {
        loanId: this.loan.loanId,
        customerId: this.loan.customerId,
        amountPaid: formValue.amountPaid,
        paymentMode: formValue.paymentMode,
        remarks: formValue.remarks
      }
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.success('Collection recorded successfully');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error creating collection', err);
        this.toast.error('Failed to record collection');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
