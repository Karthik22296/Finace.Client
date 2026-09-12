import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { loanGetAll } from '../../../../api/fn/loan/loan-get-all';
import { ApiConfiguration } from '../../../../api/api-configuration';
import { Loan } from '../../../../api/models/loan';
import { CollectionCreateComponent } from '../collection-create/collection-create.component';

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
  styleUrls: ['./collection-route.component.css']
})
export class CollectionRouteComponent implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private dialog = inject(MatDialog);

  activeLoans: Loan[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadActiveLoans();
  }

  loadActiveLoans() {
    this.isLoading = true;
    loanGetAll(this.http, this.config.rootUrl).subscribe({
      next: async (response) => {
        try {
          const text = await response.body.text();
          const loans: Loan[] = text ? JSON.parse(text) : [];
          // Assuming status 0 means Active. We should probably filter it.
          // In a real app we'd pass status=Active to the API if it supported it.
          this.activeLoans = loans.filter(l => l.status === 0);
        } catch (e) {
          console.error('Failed to parse loans', e);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading active loans', err);
        this.isLoading = false;
      }
    });
  }

  openCollectDialog(loan: Loan) {
    const dialogRef = this.dialog.open(CollectionCreateComponent, {
      width: '500px',
      data: loan,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // We could refresh or show a success message
      }
    });
  }
}
