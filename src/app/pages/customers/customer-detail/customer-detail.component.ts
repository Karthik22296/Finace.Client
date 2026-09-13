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

  customerId: number | null = null;
  customer: Customer | null = null;
  isLoading = true;
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

