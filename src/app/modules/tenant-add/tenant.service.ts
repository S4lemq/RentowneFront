import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TenantDto } from './model/tenant-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private http: HttpClient) { }

  saveTenant(dto: TenantDto): Observable<TenantDto> {
    return this.http.post<TenantDto>(`api/tenants`, dto);
  }

  getTenant(id: number): Observable<TenantDto> {
    return this.http.get<TenantDto>(`/api/tenants/` + id);
  }

  updateTenant(dto: TenantDto) {
    return this.http.put<TenantDto>(`/api/tenants`, dto);
  }

}
