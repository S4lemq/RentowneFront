import { Injectable } from '@angular/core';
import { HousingProviderDto } from './model/housing-provider-dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApartmentHousingProviderRequest } from './model/apartment-housing-provider-request';

@Injectable({
  providedIn: 'root'
})
export class HousingProviderService {

  constructor(private http: HttpClient) { }

  saveHousingProvider(dto: HousingProviderDto): Observable<number> {
    return this.http.post<number>(`/api/housing-service-provider`, dto);
  }

  getHousingProvider(id: number): Observable<HousingProviderDto> {
    return this.http.get<HousingProviderDto>(`/api/housing-service-provider/` + id);
  }

  updateHousingProvider(dto: HousingProviderDto) {
    return this.http.put<HousingProviderDto>(`/api/housing-service-provider`, dto);
  }

  addHousingProviderToApartment(dto: ApartmentHousingProviderRequest) {
    return this.http.post<ApartmentHousingProviderRequest>(`/api/apartments/add-housing-provider`, dto);
  }

}
