import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getLookupValues(lookupTypeId: number): Observable<LookupValue[]> {
    return this.http.get<LookupValue[]>(`${this.config.rootUrl}/api/lookups/${lookupTypeId}`);
  }
}
