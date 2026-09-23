import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { goBack as navigateBack } from '../../../shared/utils/navigation.util';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { customerGetById } from '../../../../api/fn/customer/customer-get-by-id';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Customer } from '../../../../api/models/customer';
import { CustomerDocumentService, CustomerDocument } from '../../../core/services/customer-document.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { parseBlobJson } from '../../../shared/utils/api-response.util';
import { downloadBlob } from '../../../shared/utils/download.util';
import { CustomerCodePipe, PhoneFormatPipe } from '../../../shared/pipes';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDialogModule,
    CustomerCodePipe,
    PhoneFormatPipe
  ],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private location = inject(Location);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private documentService = inject(CustomerDocumentService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  customerId: number | null = null;
  customer: Customer | null = null;
  documents: CustomerDocument[] = [];
  isLoading = true;
  isLoadingDocuments = false;
  error: string | null = null;

  goBack(): void {
    navigateBack(this.location, this.router, '/customers');
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.customerId = parseInt(idParam, 10);
      this.loadCustomer();
    } else {
      this.error = 'Invalid customer ID';
      this.isLoading = false;
    }
  }

  loadCustomer() {
    if (!this.customerId) return;
    
    this.isLoading = true;
    customerGetById(this.http, this.config.rootUrl, { id: this.customerId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (response) => {
          this.customer = await parseBlobJson<Customer | null>(response.body, null);
          if (!this.customer) {
            this.error = 'Failed to load customer details.';
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading customer', err);
          this.error = 'Could not find the requested customer.';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });

    this.loadDocuments();
  }

  loadDocuments() {
    if (!this.customerId) return;
    this.isLoadingDocuments = true;
    this.documentService.getDocuments(this.customerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (docs) => {
          this.documents = docs;
          this.isLoadingDocuments = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load documents', err);
          this.isLoadingDocuments = false;
          this.cdr.markForCheck();
        }
      });
  }

  downloadDocument(doc: CustomerDocument): void {
    if (!this.customerId) return;
    this.snackBar.open(`Downloading ${doc.originalFileName}...`, '', { duration: 2000 });
    this.documentService.getDocumentFile(this.customerId, doc.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          downloadBlob(blob, doc.originalFileName);
        },
        error: (err) => {
          console.error('Download failed', err);
          this.snackBar.open('Failed to download document', 'Close', { duration: 3000 });
        }
      });
  }

  async openCreateLoan() {
    if (!this.customer) return;
    const { LoanCreateComponent } = await import('../../loans/loan-create/loan-create.component');
    const dialogRef = this.dialog.open(LoanCreateComponent, {
      width: '600px',
      disableClose: true,
      data: { customerId: this.customer.customerId }
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result === true) {
        this.router.navigate(['/loans']);
      }
    });
  }
}

