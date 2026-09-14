import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../../../api/api-configuration';

export interface CustomerDocument {
  id: number;
  customerId: number;
  documentType: string;
  documentPath: string;
  originalFileName: string;
  uploadedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerDocumentService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  getDocuments(customerId: number): Observable<CustomerDocument[]> {
    return this.http.get<CustomerDocument[]>(`${this.config.rootUrl}/api/customers/${customerId}/documents`);
  }

  uploadDocument(customerId: number, file: File, documentType: string): Observable<CustomerDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    return this.http.post<CustomerDocument>(
      `${this.config.rootUrl}/api/customers/${customerId}/documents`,
      formData
    );
  }

  getDocumentFile(customerId: number, documentId: number): Observable<Blob> {
    return this.http.get(`${this.config.rootUrl}/api/customers/${customerId}/documents/${documentId}/file`, {
      responseType: 'blob'
    });
  }

  deleteDocument(customerId: number, documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.config.rootUrl}/api/customers/${customerId}/documents/${documentId}`);
  }
}
