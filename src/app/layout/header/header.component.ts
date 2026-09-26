import { Component, EventEmitter, OnInit, Output, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { ApiConfiguration } from '../../../api/api-configuration';
import { searchGlobalSearch } from '../../../api/fn/search/search-global-search';
import { notificationGetNotifications } from '../../../api/fn/notification/notification-get-notifications';
import { notificationMarkAsRead } from '../../../api/fn/notification/notification-mark-as-read';
import { notificationMarkAllAsRead } from '../../../api/fn/notification/notification-mark-all-as-read';
import { userGetProfile } from '../../../api/fn/user/user-get-profile';
import { userUploadProfilePhoto } from '../../../api/fn/user/user-upload-profile-photo';
import { GlobalSearchResultDto, NotificationDto, UserResponse } from '../../../api/models';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();

  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);

  // ── Search State ───────────────────────────────────────────
  searchQuery = '';
  searchResults: GlobalSearchResultDto | null = null;
  isSearching = false;
  private searchSubject = new Subject<string>();
  showSearchOverlay = false;

  // ── Notification State ─────────────────────────────────────
  notifications: NotificationDto[] = [];
  unreadCount = 0;

  // ── Profile State ──────────────────────────────────────────
  userProfile: UserResponse | null = null;
  showProfileModal = false;

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUserProfile();

    // Debounced search pipeline — cancels in-flight requests on new input
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim().length < 2) {
          this.searchResults = null;
          this.isSearching = false;
          this.cdr.markForCheck();
          return of(null);
        }
        this.isSearching = true;
        this.cdr.markForCheck();
        return searchGlobalSearch(this.http, this.config.rootUrl, { q: query });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        if (res) {
          this.searchResults = res.body || null;
        }
        this.isSearching = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSearching = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ── Computed display values ────────────────────────────────
  get userName(): string {
    if (this.userProfile?.fullName) return this.userProfile.fullName;
    const sessionUser = this.authService.currentUser();
    if (sessionUser?.fullName) return sessionUser.fullName;
    const role = this.authService.getRole();
    return role === 'Admin' ? 'Administrator' : 'Field Collector';
  }

  get userInitials(): string {
    return this.userName
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  get userAvatarUrl(): string | null {
    if (this.userProfile?.profilePhotoUrl && this.userProfile?.id) {
      return `${this.config.rootUrl}/api/users/profile-photo/file?userId=${this.userProfile.id}`;
    }
    return null;
  }

  get userRole(): string {
    if (this.userProfile?.roles?.length) return this.userProfile.roles.join(', ');
    const sessionUser = this.authService.currentUser();
    if (sessionUser?.roles?.length) return sessionUser.roles.join(', ');
    return this.authService.getRole() === 'Admin' ? 'Branch Manager' : 'Collector';
  }

  // ── Sidenav ────────────────────────────────────────────────
  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  // ── API: Load User Profile ─────────────────────────────────
  loadUserProfile(): void {
    userGetProfile(this.http, this.config.rootUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.body) {
            this.userProfile = res.body;
            this.cdr.markForCheck();
          }
        },
        error: (err) => console.error('Failed to load profile', err)
      });
  }

  // ── API: Load Notifications ────────────────────────────────
  loadNotifications(): void {
    notificationGetNotifications(this.http, this.config.rootUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.body) {
            this.notifications = res.body;
            this.unreadCount = this.notifications.filter(n => !n.isRead).length;
            this.cdr.markForCheck();
          }
        },
        error: (err) => console.error('Failed to load notifications', err)
      });
  }

  onMarkRead(notif: NotificationDto, event: MouseEvent): void {
    event.stopPropagation();
    if (!notif.id) return;
    notificationMarkAsRead(this.http, this.config.rootUrl, { id: notif.id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          notif.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          this.snackBar.open('Marked as read', 'Close', { duration: 2000 });
          this.cdr.markForCheck();
        }
      });
  }

  onMarkAllRead(): void {
    notificationMarkAllAsRead(this.http, this.config.rootUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.forEach(n => n.isRead = true);
          this.unreadCount = 0;
          this.snackBar.open('All notifications marked as read', 'Close', { duration: 2000 });
          this.cdr.markForCheck();
        }
      });
  }

  // ── API: Global Search ─────────────────────────────────────
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSearchFocus(): void {
    this.showSearchOverlay = true;
  }

  closeSearchOverlay(): void {
    setTimeout(() => {
      this.showSearchOverlay = false;
      this.cdr.markForCheck();
    }, 200);
  }

  navigateToCustomer(id: number | undefined): void {
    if (!id) return;
    this.showSearchOverlay = false;
    this.searchQuery = '';
    this.router.navigate(['/customers', id]);
  }

  navigateToLoan(id: number | undefined): void {
    if (!id) return;
    this.showSearchOverlay = false;
    this.searchQuery = '';
    this.router.navigate(['/loans']);
  }

  // ── Dialogs ────────────────────────────────────────────────
  onViewProfile(): void {
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  onUploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.snackBar.open('Uploading photo...', '', { duration: 2000 });
    userUploadProfilePhoto(this.http, this.config.rootUrl, { body: { file } })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.body && this.userProfile) {
            this.userProfile.profilePhotoUrl = res.body.photoUrl;
            this.snackBar.open('Profile photo updated!', 'Close', { duration: 3000 });
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          console.error('Failed to upload photo', err);
          this.snackBar.open('Failed to upload photo', 'Close', { duration: 3000 });
        }
      });
  }

  onOpenSettings(): void {
    this.snackBar.open('⚙️ System Settings — Branch & System preferences configured.', 'Close', { duration: 3000 });
  }

  // ── Auth ───────────────────────────────────────────────────
  logout(): void {
    this.authService.logout();
  }
}
