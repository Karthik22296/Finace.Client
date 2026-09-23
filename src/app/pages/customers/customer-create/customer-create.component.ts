import { Component, inject, ViewEncapsulation, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { LookupService, LookupValue } from '../../../core/services/lookup.service';
import { CustomerDocumentService } from '../../../core/services/customer-document.service';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { customerCreate } from '../../../../api/fn/customer/customer-create';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { ToastService } from '../../../core/services/toast.service';
import { formatFileSize } from '../../../shared/utils/format.util';
import { Step1CustomerDetailsComponent } from './components/step1-customer-details/step1-customer-details.component';
import { Step2DocumentsComponent } from './components/step2-documents/step2-documents.component';
import { Step3ReviewComponent } from './components/step3-review/step3-review.component';

export interface UploadedFile {
  name: string;
  size: string;
  previewUrl?: string | null;
  rawFile?: File;
}

export interface AdditionalDocItem {
  id: number;
  docType: string;
  file: UploadedFile | null;
}

export interface BranchOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    MatChipsModule,
    Step1CustomerDetailsComponent,
    Step2DocumentsComponent,
    Step3ReviewComponent
  ],
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialogRef = inject(MatDialogRef<CustomerCreateComponent>, { optional: true });
  private toastService = inject(ToastService);
  private location = inject(Location);
  private router = inject(Router);
  private lookupService = inject(LookupService);
  private documentService = inject(CustomerDocumentService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  genders: LookupValue[] = [];
  idTypesLookup: LookupValue[] = [];
  docTypesLookup: LookupValue[] = [];
  occupations: LookupValue[] = [];
  profilePhotoFile: File | null = null;
  isLoading = false;
  currentStep = 1;
  profilePhotoUrl: string | null = null;
  registrationDate = new Date();
  isIdNumberVisible = false;

  branches: BranchOption[] = [
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

  idTypes = [
    'Aadhaar Card',
    'PAN Card',
    'Voter ID',
    'Passport',
    'Driving License'
  ];

  additionalDocTypes = [
    'Income Proof',
    'Bank Statement',
    'Address Proof',
    'Other'
  ];

  idProofFile: UploadedFile | null = null;
  additionalDocs: AdditionalDocItem[] = [];

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
    notes: [''],

    idType: ['', Validators.required],
    idNumber: ['', Validators.required]
  });

  ngOnInit(): void {
    forkJoin({
      genders: this.lookupService.getLookupValues(1),
      docTypes: this.lookupService.getLookupValues(2),
      occupations: this.lookupService.getLookupValues(3),
      idTypes: this.lookupService.getLookupValues(4)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ genders, docTypes, occupations, idTypes }) => {
          this.genders = genders;
          this.docTypesLookup = docTypes.filter(x => x.code !== 'PROFILE_PHOTO');
          this.occupations = occupations;
          this.idTypesLookup = idTypes;
          this.cdr.markForCheck();
        },
        error: (err) => console.error('Failed to load lookup data', err)
      });
  }

  get selectedBranchName(): string {
    const branchId = this.customerForm.get('branchId')?.value;
    const branch = this.branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Main Branch';
  }

  get isIdTypeSelected(): boolean {
    return !!this.customerForm.get('idType')?.value;
  }

  get isIdNumberEntered(): boolean {
    return !!this.customerForm.get('idNumber')?.value;
  }

  get isIdProofUploaded(): boolean {
    return !!this.idProofFile;
  }

  get isPhotoUploaded(): boolean {
    return !!this.profilePhotoUrl;
  }

  toggleIdNumberVisibility(): void {
    this.isIdNumberVisible = !this.isIdNumberVisible;
    this.cdr.markForCheck();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.profilePhotoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePhotoUrl = e.target?.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  triggerPhotoUpload(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onIdProofSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.idProofFile = {
        name: file.name,
        size: formatFileSize(file.size),
        rawFile: file
      };
      this.toastService.success('Uploaded');
      this.cdr.markForCheck();
    }
  }

  removeIdProof(): void {
    this.idProofFile = null;
    this.cdr.markForCheck();
  }

  addAnotherDocument(): void {
    this.additionalDocs.push({
      id: Date.now(),
      docType: 'Income Proof',
      file: null
    });
    this.cdr.markForCheck();
  }

  removeAdditionalDoc(index: number): void {
    this.additionalDocs.splice(index, 1);
    this.cdr.markForCheck();
  }

  onAdditionalDocSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.additionalDocs[index].file = {
        name: file.name,
        size: formatFileSize(file.size),
        rawFile: file
      };
      this.cdr.markForCheck();
    }
  }

  goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
      this.cdr.markForCheck();
    } else if (step === 2 && this.currentStep === 1) {
      this.nextStep();
    } else if (step === 3 && this.currentStep === 2) {
      this.nextStep();
    }
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const step1Controls = ['fullName', 'dateOfBirth', 'mobileNumber', 'addressLine1', 'city', 'state', 'pincode', 'branchId'];
      let isValid = true;
      step1Controls.forEach(ctrl => {
        const c = this.customerForm.get(ctrl);
        if (c && c.invalid) {
          c.markAsTouched();
          isValid = false;
        }
      });
      if (!isValid) {
        this.toastService.error('Please fill in all required Step 1 fields correctly.');
        return;
      }
      this.currentStep = 2;
      this.cdr.markForCheck();
    } else if (this.currentStep === 2) {
      const step2Controls = ['idType', 'idNumber'];
      let isValid = true;
      step2Controls.forEach(ctrl => {
        const c = this.customerForm.get(ctrl);
        if (c && c.invalid) {
          c.markAsTouched();
          isValid = false;
        }
      });
      if (!isValid) {
        this.toastService.error('Please select ID Type and enter ID Number.');
        return;
      }
      if (!this.idProofFile) {
        this.toastService.error('Please upload an ID proof document.');
        return;
      }
      this.currentStep = 3;
      this.cdr.markForCheck();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.cdr.markForCheck();
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
        idProofType: formValue.idType || 'Aadhaar Card',
        idProofNumber: formValue.idNumber || '',
        branchId: formValue.branchId!
      }
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.cdr.markForCheck();
      }
    });
  }

  finalizeSubmit(): void {
    this.isLoading = false;
    this.toastService.success('Customer profile created successfully');
    if (this.dialogRef) {
      this.dialogRef.close(true);
    } else {
      this.router.navigate(['/customers']);
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
