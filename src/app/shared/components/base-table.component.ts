import { Directive, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Directive()
export abstract class BaseTableComponent<T> implements AfterViewInit {
  dataSource = new MatTableDataSource<T>();
  isLoading = true;
  hasError = false;
  errorMessage: string | null = null;
  filterValues: Record<string, string> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setError(error: unknown, fallback = 'Failed to load data. Please check your connection and try again.'): void {
    this.isLoading = false;
    this.hasError = true;
    if (typeof error === 'string') {
      this.errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      this.errorMessage = String((error as { message: string }).message);
    } else {
      this.errorMessage = fallback;
    }
  }

  clearError(): void {
    this.hasError = false;
    this.errorMessage = null;
  }

  startLoading(): void {
    this.isLoading = true;
    this.clearError();
  }

  /**
   * Applies filter to the MatTableDataSource.
   * Call this from your search inputs.
   */
  applyFilter(column: string, event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues[column] = filterValue.trim().toLowerCase();
    
    // Assigning a stringified JSON object to dataSource.filter triggers the filterPredicate
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
