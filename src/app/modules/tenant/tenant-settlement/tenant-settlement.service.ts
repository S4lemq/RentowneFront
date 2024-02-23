import { Injectable } from '@angular/core';
import { BasicSettlementDto } from '../tenant-profile/model/basic-settlement-dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TenantSettlementSummary } from '../tenant-profile/model/tenant-settlement-summary';
import { TenantSettlementDto } from '../tenant-profile/model/tenant-settlement-dto';

@Injectable({
  providedIn: 'root'
})
export class TenantSettlementService {

  constructor(private http: HttpClient) { }

  getBasicSettlementData(): Observable<BasicSettlementDto> {
    return this.http.get<BasicSettlementDto>(`/api/tenant/get-financial-data`);
  }

  placeSettlement(dto: TenantSettlementDto): Observable<TenantSettlementSummary> {
    return this.http.post<TenantSettlementSummary>(`/api/tenant/tenant-settlement`, dto);
  }
}
