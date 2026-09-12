import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { FooterComponent } from './layout/footer/footer.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    MatSidenavModule,
    HeaderComponent,
    SidenavComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'finance.client';
  
  isSidenavOpened = true;
  sidenavMode: 'side' | 'over' = 'side';
  
  private destroy$ = new Subject<void>();
  private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    // Automatically adjust sidenav based on screen size (mobile responsiveness)
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.matches) {
          // Mobile/Tablet: Hide by default, display over content when toggled
          this.isSidenavOpened = false;
          this.sidenavMode = 'over';
        } else {
          // Desktop: Show by default, pin to the side
          this.isSidenavOpened = true;
          this.sidenavMode = 'side';
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
