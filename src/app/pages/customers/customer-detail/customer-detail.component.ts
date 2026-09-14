import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { customerGetById } from '../../../../api/fn/customer/customer-get-by-id';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Customer } from '../../../../api/models/customer';
import { CustomerDocumentService, CustomerDocument } from '../../../core/services/customer-document.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoanCreateComponent } from '../../loans/loan-create/loan-create.component';

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
    MatDialogModule
  ],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
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

  customerId: number | null = null;
  customer: Customer | null = null;
  documents: CustomerDocument[] = [];
  isLoading = true;
  isLoadingDocuments = false;
  error: string | null = null;

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/customers']);
    }
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
    customerGetById(this.http, this.config.rootUrl, { id: this.customerId }).subscribe({
      next: async (response) => {
        try {
          const text = await response.body.text();
          this.customer = text ? JSON.parse(text) : null;
        } catch (e) {
          console.error('Failed to parse customer details', e);
          this.error = 'Failed to load customer details.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading customer', err);
        this.error = 'Could not find the requested customer.';
        this.isLoading = false;
      }
    });

    this.loadDocuments();
  }

  loadDocuments() {
    if (!this.customerId) return;
    this.isLoadingDocuments = true;
    this.documentService.getDocuments(this.customerId).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.isLoadingDocuments = false;
      },
      error: (err) => {
        console.error('Failed to load documents', err);
        this.isLoadingDocuments = false;
      }
    });
  }

  downloadDocument(doc: CustomerDocument): void {
    if (!this.customerId) return;
    this.snackBar.open(`Downloading ${doc.originalFileName}...`, '', { duration: 2000 });
    this.documentService.getDocumentFile(this.customerId, doc.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.originalFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
        this.snackBar.open('Failed to download document', 'Close', { duration: 3000 });
      }
    });
  }

  openCreateLoan() {
    if (!this.customer) return;
    const dialogRef = this.dialog.open(LoanCreateComponent, {
      width: '600px',
      disableClose: true,
      data: { customerId: this.customer.customerId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(['/loans']);
      }
    });
  }
}

