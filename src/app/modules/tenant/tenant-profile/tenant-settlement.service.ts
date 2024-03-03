import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationDto } from './model/notification-dto';
import { Payment } from './model/payment';
import { TenantSettlementDto } from './model/tenant-settlement-dto';
import { TenantSettlementSummary } from './model/tenant-settlement-summary';

@Injectable({
  providedIn: 'root'
})
export class TenantSettlementService {

  constructor(private http: HttpClient) { }

  getPaymentMethods(): Observable<Array<Payment>> {
    return this.http.get<Array<Payment>>(`/api/tenant/get-payments-method`);
  }

  placeSettlement(dto: TenantSettlementDto): Observable<TenantSettlementSummary> {
    return this.http.post<TenantSettlementSummary>(`/api/tenant/tenant-settlement`, dto);
  }

  getStatus(hash: any): Observable<NotificationDto> {
    return this.http.get<NotificationDto>(`/api/tenant/notification/` + hash);
  }
}
