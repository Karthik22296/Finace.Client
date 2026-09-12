import { Directive, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Directive()
export abstract class BaseTableComponent<T> {
  dataSource = new MatTableDataSource<T>();
  isLoading = true;
  filterValues: Record<string, string> = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  /**
   * You should define your custom filterPredicate in ngOnInit of your subclass.
   * Example:
   * this.dataSource.filterPredicate = (data: T, filter: string) => {
   *   const searchTerms = JSON.parse(filter);
   *   return data.field.includes(searchTerms.field);
   * };
   */
}
