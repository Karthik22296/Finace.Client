import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
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
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css'],
  providers: [provideNativeDateAdapter()]
})
export class CustomerCreateComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialogRef = inject(MatDialogRef<CustomerCreateComponent>, { optional: true });
  private toastService = inject(ToastService);
  private location = inject(Location);
  private router = inject(Router);

  isLoading = false;

  customerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: [''],
    dateOfBirth: [null as string | null],
    gender: [''],
    alternateNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
    occupationType: [''],
    idProofType: [''],
    idProofNumber: [''],
    branchId: [1]
  });

  onSubmit() {
    if (this.customerForm.valid) {
      this.isLoading = true;
      const formValue = this.customerForm.value;

      customerCreate(this.http, this.config.rootUrl, {
        body: {
          fullName: formValue.fullName!,
          mobileNumber: formValue.mobileNumber!,
          address: formValue.address,
          dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth).toISOString() : undefined,
          gender: formValue.gender,
          alternateNumber: formValue.alternateNumber,
          occupationType: formValue.occupationType,
          idProofType: formValue.idProofType,
          idProofNumber: formValue.idProofNumber,
          branchId: formValue.branchId!
        }
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastService.success('Customer created successfully');
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['/customers']);
          }
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
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.location.back();
    }
  }
}

