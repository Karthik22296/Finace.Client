import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiConfiguration } from '../../../api/api-configuration';
import { reportsDashboardSummary } from '../../../api/fn/reports/reports-dashboard-summary';
import { reminderGetReminders } from '../../../api/fn/reminder/reminder-get-reminders';
import { reminderToggleComplete } from '../../../api/fn/reminder/reminder-toggle-complete';
import { DashboardSummaryDto, DashboardActivityDto, DashboardTrendBarDto, ReminderDto } from '../../../api/models';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  // ── Live Calculated State ─────────────────────────────────
  isLoading = true;
  totalCustomers = 0;
  totalActiveLoans = 0;
  todaysTarget = 0;
  collectedAmount = 0;
  shortfall = 0;
  collectionProgress = 0;
  totalPortfolioValue = 0;

  activeLoanPct = 80;
  overdueLoanPct = 15;
  npaLoanPct = 5;

  chartBars: DashboardTrendBarDto[] = [];
  recentActivities: DashboardActivityDto[] = [];
  reminders: ReminderDto[] = [];

  // ── Display Fields (computed once) ────────────────────────
  greeting = '';
  userName = '';
  todayFormatted = '';
  donutGradient = '';

  // ── Chart ──────────────────────────────────────────────────
  trendTabs = ['7 Days', '30 Days', '6 Months', '1 Year'];
  activeTrendTab = '7 Days';

  // ── Lifecycle ──────────────────────────────────────────────
  ngOnInit(): void {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    const role = this.authService.getRole();
    this.userName = role === 'Admin' ? 'Administrator' : 'Collector';
    this.todayFormatted = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    this.loadDashboardData();
    this.loadReminders();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    reportsDashboardSummary(this.http, this.config.rootUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const summary: DashboardSummaryDto | null = res.body || null;
          if (summary) {
            this.totalCustomers = summary.totalCustomers || 0;
            this.totalActiveLoans = summary.totalActiveLoans || 0;
            this.todaysTarget = summary.todaysTarget || 0;
            this.collectedAmount = summary.collectedAmount || 0;
            this.shortfall = summary.shortfall || 0;
            this.collectionProgress = summary.collectionProgress || 0;
            this.totalPortfolioValue = summary.totalPortfolioValue || 0;

            this.activeLoanPct = summary.activeLoanPct ?? 80;
            this.overdueLoanPct = summary.overdueLoanPct ?? 15;
            this.npaLoanPct = summary.npaLoanPct ?? 5;

            // Recompute donut gradient from API data
            const greenEnd = this.activeLoanPct;
            const yellowEnd = greenEnd + this.overdueLoanPct;
            this.donutGradient = `conic-gradient(
              #34a853 0% ${greenEnd}%,
              #fbbc04 ${greenEnd}% ${yellowEnd}%,
              #ea4335 ${yellowEnd}% 100%
            )`;

            this.chartBars = summary.trendBars || [];
            this.recentActivities = summary.recentActivities || [];
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to fetch dashboard summary from API', err);
          this.snackBar.open('Failed to load dashboard metrics.', 'Close', { duration: 3000 });
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  loadReminders(): void {
    reminderGetReminders(this.http, this.config.rootUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.body && res.body.length > 0) {
            this.reminders = res.body;
          } else {
            this.setFallbackReminders();
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.setFallbackReminders();
          this.cdr.markForCheck();
        }
      });
  }

  private setFallbackReminders(): void {
    this.reminders = [
      { id: 1, time: '10:30 AM', icon: 'event', type: 'orange', title: 'Follow up – Customer #1', sub: 'EMI overdue (5 days)', isCompleted: false },
      { id: 2, time: '12:00 PM', icon: 'directions_car', type: 'blue', title: 'Field Visit – Customer #2', sub: 'KYC verification & signature', isCompleted: false },
      { id: 3, time: '03:00 PM', icon: 'call', type: 'green', title: 'Call – Customer #3', sub: 'Loan renewal discussion', isCompleted: false }
    ];
  }

  // ── Action Handlers ──

  onSelectTrendTab(tab: string): void {
    this.activeTrendTab = tab;
    this.snackBar.open(`Collection Trend filter changed to: ${tab}`, 'Close', { duration: 2500 });
    this.cdr.markForCheck();
  }

  onKpiClick(type: 'customers' | 'loans' | 'collections' | 'portfolio'): void {
    const routes: Record<string, string> = {
      customers: '/customers',
      loans: '/loans',
      collections: '/collections/route',
      portfolio: '/reports'
    };
    if (routes[type]) {
      this.router.navigate([routes[type]]);
    }
  }

  openNewCustomerDialog(): void {
    this.router.navigate(['/customers/new']);
  }

  async openNewLoanDialog(): Promise<void> {
    const { LoanCreateComponent } = await import('../loans/loan-create/loan-create.component');
    const dialogRef = this.dialog.open(LoanCreateComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result === true) {
        this.loadDashboardData();
      }
    });
  }

  onViewAllReminders(): void {
    this.snackBar.open('Showing all scheduled field visits & collector tasks.', 'Close', { duration: 3000 });
  }

  onReminderClick(reminder: ReminderDto): void {
    if (reminder.id === undefined) return;
    reminderToggleComplete(this.http, this.config.rootUrl, { id: reminder.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          reminder.isCompleted = !reminder.isCompleted;
          const msg = reminder.isCompleted ? `Task completed: ${reminder.title}` : `Task reopened: ${reminder.title}`;
          this.snackBar.open(msg, 'Close', { duration: 2500 });
          this.cdr.markForCheck();
        },
        error: () => {
          reminder.isCompleted = !reminder.isCompleted;
          this.snackBar.open(`Task status toggled locally: ${reminder.title}`, 'Close', { duration: 2500 });
          this.cdr.markForCheck();
        }
      });
  }
}

