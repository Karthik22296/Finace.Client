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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { customerCreate } from '../../../../api/fn/customer/customer-create';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatChipsModule
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
  currentStep = 1;
  profilePhotoUrl: string | null = null;
  registrationDate = new Date();

  branches = [
    { id: 1, name: 'Main Branch' },
    { id: 2, name: 'City Branch' },
    { id: 3, name: 'West Branch' }
  ];

  statesList = [
    'Tamil Nadu',
    'Karnataka',
    'Kerala',
    'Andhra Pradesh',
    'Telangana',
    'Maharashtra',
    'Delhi',
    'Gujarat'
  ];

  customerForm = this.fb.group({
    customerType: ['Individual', Validators.required],
    title: ['Mr.', Validators.required],
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z\\s]+$')]],
    dateOfBirth: [null as Date | null, Validators.required],
    gender: ['Male', Validators.required],
    mobilePrefix: ['+91'],
    mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    alternatePrefix: ['+91'],
    alternateNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.email]],
    maritalStatus: [''],
    addressLine1: ['', Validators.required],
    addressLine2: [''],
    city: ['', Validators.required],
    state: ['Tamil Nadu', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    branchId: [1, Validators.required],
    notes: ['']
  });

  get selectedBranchName(): string {
    const branchId = this.customerForm.get('branchId')?.value;
    const branch = this.branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Main Branch';
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePhotoUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerPhotoUpload(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.customerForm.invalid) {
        this.customerForm.markAllAsTouched();
        this.toastService.error('Please fill in all required fields correctly.');
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.currentStep = 3;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.toastService.error('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;
    const formValue = this.customerForm.value;

    const fullAddress = [
      formValue.addressLine1,
      formValue.addressLine2,
      formValue.city,
      formValue.state,
      formValue.pincode
    ].filter(Boolean).join(', ');

    customerCreate(this.http, this.config.rootUrl, {
      body: {
        fullName: formValue.fullName ? `${formValue.title || ''} ${formValue.fullName}`.trim() : '',
        mobileNumber: formValue.mobileNumber!,
        address: fullAddress,
        dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth).toISOString() : undefined,
        gender: formValue.gender,
        alternateNumber: formValue.alternateNumber || null,
        occupationType: formValue.customerType || 'Individual',
        branchId: formValue.branchId!
      }
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Customer profile created successfully');
        if (this.dialogRef) {
          this.dialogRef.close(true);
        } else {
          this.router.navigate(['/customers']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating customer', err);
        this.toastService.error('Failed to create customer profile');
      }
    });
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.location.back();
    }
  }
}

