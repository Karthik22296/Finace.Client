import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { customerCreate } from '../../../../api/fn/customer/customer-create';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialogRef = inject(MatDialogRef<CustomerCreateComponent>);
  private toastService = inject(ToastService);

  isLoading = false;

  customerForm = this.fb.group({
    customerCode: ['', [Validators.required, Validators.maxLength(20)]],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: [''],
    // Hardcode branch for now, or could be fetched from API
    branchId: [1]
  });

  onSubmit() {
    if (this.customerForm.valid) {
      this.isLoading = true;
      const formValue = this.customerForm.value;

      customerCreate(this.http, this.config.rootUrl, {
        body: {
          customerCode: formValue.customerCode!,
          fullName: formValue.fullName!,
          mobileNumber: formValue.mobileNumber!,
          address: formValue.address,
          branchId: formValue.branchId!
        }
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.success('Customer created successfully');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error creating customer', err);
          this.toastService.error('Failed to create customer');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
