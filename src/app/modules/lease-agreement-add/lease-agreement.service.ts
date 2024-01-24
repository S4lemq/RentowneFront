import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeaseAgreementDto } from './model/lease-agreement-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaseAgreementService {

  constructor(private http: HttpClient) { }

  saveLeaseAgreement(dto: LeaseAgreementDto): Observable<LeaseAgreementDto> {
    return this.http.post<LeaseAgreementDto>(`/api/lease-agreements`, dto);
  }

  getLeaseAgreementDto(id: number): Observable<LeaseAgreementDto> {
    return this.http.get<LeaseAgreementDto>(`/api/lease-agreements/` + id);
  }

}
