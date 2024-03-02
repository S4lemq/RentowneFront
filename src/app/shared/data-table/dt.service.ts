import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DTRow } from './DTRow';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DTService {

  private apiUrl = '/api/access/files';

  constructor(private http: HttpClient) { }

  getItems(dtDefinition: string, pageNumber: number, pageSize: number, sortDirection?: string, sortColumnName?: string, text?: string, filter?: any): Observable<DTRow[]> {
    const params = {
      dtDefinition,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(sortDirection && {sortDirection}),
      ...(sortColumnName && {sortColumnName}),
      ...(text && {text})
    };
    return this.http.post<DTRow[]>(`${this.apiUrl}/items`, filter, { params });
  }

  getItemsCount(dtDefinition: string, text?: string, filter?: any): Observable<number> {
    const params = {
      dtDefinition,
      ...(text && {text})
    };
    return this.http.post<number>(`${this.apiUrl}/items-count`, filter, { params });
  }

}

