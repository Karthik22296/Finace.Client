import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../../../api/api-configuration';
import { loanGetAll } from '../../../api/fn/loan/loan-get-all';
import { collectionGetAll } from '../../../api/fn/collection/collection-get-all';
import { Loan } from '../../../api/models/loan';
import { Collection } from '../../../api/models/collection';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  isLoading = true;
  totalActiveLoans = 0;
  todaysTarget = 0;
  collectedAmount = 0;
  shortfall = 0;
  collectionProgress = 0;

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.isLoading = true;
    try {
      // Fetch all loans (filter to active in frontend)
      loanGetAll(this.http, this.config.rootUrl, { isClosed: false }).subscribe({
        next: async (res) => {
          const text = await res.body.text();
          const loans: Loan[] = text ? JSON.parse(text) : [];
          this.totalActiveLoans = loans.length;
          this.todaysTarget = loans.reduce((sum, loan) => sum + (loan.dailyDueAmount || 0), 0);
          this.calculateProgress();
        }
      });

      // Fetch today's collections
      const today = new Date().toISOString().split('T')[0];
      collectionGetAll(this.http, this.config.rootUrl, { date: today }).subscribe({
        next: async (res) => {
          const text = await res.body.text();
          const collections: Collection[] = text ? JSON.parse(text) : [];
          // Sum verified/approved collections (verificationStatus === 1 for Approved, or maybe just include all for now if they are entered)
          // Based on normal operation, any collection entered goes towards the collected amount for the day's visibility
          this.collectedAmount = collections.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
          this.calculateProgress();
        }
      });
      
    } catch (e) {
      console.error('Error loading dashboard data', e);
    } finally {
      this.isLoading = false;
    }
  }

  private calculateProgress() {
    this.shortfall = Math.max(0, this.todaysTarget - this.collectedAmount);
    if (this.todaysTarget > 0) {
      this.collectionProgress = Math.min(100, Math.round((this.collectedAmount / this.todaysTarget) * 100));
    }
  }
}
