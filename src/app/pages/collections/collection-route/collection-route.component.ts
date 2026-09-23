import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { goBack as navigateBack } from '../../../shared/utils/navigation.util';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { loanGetAll } from '../../../../api/fn/loan/loan-get-all';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Loan } from '../../../../api/models/loan';
import { parseBlobJson } from '../../../shared/utils/api-response.util';

@Component({
  selector: 'app-collection-route',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './collection-route.component.html',
  styleUrls: ['./collection-route.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionRouteComponent implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialog = inject(MatDialog);
  private location = inject(Location);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  activeLoans: Loan[] = [];
  isLoading = true;

  goBack(): void {
    navigateBack(this.location, this.router, '/dashboard');
  }

  ngOnInit(): void {
    this.loadActiveLoans();
  }

  loadActiveLoans() {
    this.isLoading = true;
    loanGetAll(this.http, this.config.rootUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: async (response) => {
          const loans = await parseBlobJson<Loan[]>(response.body, []);
          this.activeLoans = loans.filter(l => l.status === 0);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading active loans', err);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  async openCollectDialog(loan: Loan) {
    const { CollectionCreateComponent } = await import('../collection-create/collection-create.component');
    const dialogRef = this.dialog.open(CollectionCreateComponent, {
      width: '500px',
      data: loan,
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result === true) {
        this.loadActiveLoans();
      }
    });
  }
}

