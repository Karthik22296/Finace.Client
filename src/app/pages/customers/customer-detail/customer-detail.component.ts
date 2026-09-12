import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { customerGetById } from '../../../../api/fn/customer/customer-get-by-id';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Customer } from '../../../../api/models/customer';

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
    MatTabsModule
  ],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  customerId: number | null = null;
  customer: Customer | null = null;
  isLoading = true;
  error: string | null = null;

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
}
