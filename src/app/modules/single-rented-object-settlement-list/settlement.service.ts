import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalculateRequestDto } from './model/calculate-request-dto';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {

  constructor(private http: HttpClient) { }

  calculate(id: number, dto: CalculateRequestDto): Observable<any> {
    return this.http.post<CalculateRequestDto>("/api/rented-objects/" + id + "/calculate", dto);
  }

  exportSettlements(from: string, to: string, id: number): Observable<any> {
    return this.http.get(`/api/rented-objects/${id}/calculate/export?from=${from}&to=${to}`, 
      {responseType: 'blob', observe: 'response'}
    );
  }

  getSettlementStatistics(): Observable<any> {
    return this.http.get("/api/settlements/stats")
  }
}
