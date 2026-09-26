import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { goBack as navigateBack } from '../../../shared/utils/navigation.util';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { collectionGetAll } from '../../../../api/fn/collection/collection-get-all';
import { collectionVerify } from '../../../../api/fn/collection/collection-verify';
import { collectionApprove } from '../../../../api/fn/collection/collection-approve';
import { collectionReject } from '../../../../api/fn/collection/collection-reject';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Collection } from '../../../../api/models/collection';
import { BaseTableComponent } from '../../../shared/components/base-table.component';
import { ToastService } from '../../../core/services/toast.service';
import { parseBlobJson } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-collection-verify',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule
  ],
  templateUrl: './collection-verify.component.html',
  styleUrls: ['./collection-verify.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionVerifyComponent extends BaseTableComponent<Collection> implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private toast = inject(ToastService);
  private location = inject(Location);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  goBack(): void {
    navigateBack(this.location, this.router, '/dashboard');
  }

  displayedColumns: string[] = ['collectionCode', 'date', 'customer', 'collector', 'amount', 'status', 'actions'];
  
  override filterValues = {
    collectionCode: '',
    customer: ''
  };

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Collection, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const customerName = data.customer?.fullName || '';
      return (data.collectionCode || '').toLowerCase().includes(searchTerms.collectionCode)
          && customerName.toLowerCase().includes(searchTerms.customer);
    };
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'customer': return item.customer?.fullName?.toLowerCase() || '';
        case 'collector': return item.collector?.userName?.toLowerCase() || item.collectorId || 'admin';
        case 'date': return item.collectionDate || '';
        case 'amount': return item.amountPaid || 0;
        case 'status': return item.verificationStatus || 0;
        default: return (item as unknown as Record<string, unknown>)[property] as string | number;
      }
    };
    this.loadCollections();
  }

  totalAmount = 0;

  override applyFilter(column: string, event: Event) {
    super.applyFilter(column, event);
    this.updateTotalAmount();
  }

  updateTotalAmount(): void {
    this.totalAmount = this.dataSource.filteredData
      .map(t => t.amountPaid || 0)
      .reduce((acc, value) => acc + value, 0);
  }

  loadCollections() {
    this.startLoading();
    collectionGetAll(this.http, this.config.rootUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (response) => {
          this.dataSource.data = await parseBlobJson<Collection[]>(response.body, []);
          this.updateTotalAmount();
          this.isLoading = false;
          this.clearError();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.setError(err, 'Failed to load collections for verification. Please verify your connection.');
          this.cdr.markForCheck();
        }
      });
  }

  verifyCollection(id: number) {
    collectionVerify(this.http, this.config.rootUrl, { id, body: {} })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Collection Verified');
          this.loadCollections();
        },
        error: () => this.toast.error('Failed to verify collection')
      });
  }

  approveCollection(id: number) {
    collectionApprove(this.http, this.config.rootUrl, { id, body: {} })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Collection Approved');
          this.loadCollections();
        },
        error: () => this.toast.error('Failed to approve collection')
      });
  }

  rejectCollection(id: number) {
    collectionReject(this.http, this.config.rootUrl, { id, body: {} })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Collection Rejected');
          this.loadCollections();
        },
        error: () => this.toast.error('Failed to reject collection')
      });
  }

  getStatusName(status: number | undefined): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Verified';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number | undefined): string {
    switch (status) {
      case 0: return 'pending';
      case 1: return 'verified';
      case 2: return 'active';
      case 3: return 'inactive';
      default: return '';
    }
  }

  getTotalAmount() {
    return this.dataSource.filteredData.map(t => t.amountPaid || 0).reduce((acc, value) => acc + value, 0);
  }
}

