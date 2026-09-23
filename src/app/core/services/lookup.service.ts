import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { ApiConfiguration } from '../../../api/api-configuration';

export interface LookupValue {
  id: number;
  lookupTypeId: number;
  code: string;
  displayName: string;
  sortOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private cache = new Map<number, Observable<LookupValue[]>>();

  getLookupValues(lookupTypeId: number): Observable<LookupValue[]> {
    if (!this.cache.has(lookupTypeId)) {
      this.cache.set(
        lookupTypeId,
        this.http.get<LookupValue[]>(`${this.config.rootUrl}/api/lookups/${lookupTypeId}`).pipe(
          shareReplay(1)
        )
      );
    }
    return this.cache.get(lookupTypeId)!;
  }
}
