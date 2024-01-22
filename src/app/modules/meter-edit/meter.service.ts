import { Injectable } from '@angular/core';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MeterDto } from './model/meter-dto';

@Injectable({
  providedIn: 'root'
})
export class MeterService {

  constructor(private http: HttpClient) { }

  getMeters(id: number): Observable<Array<RentedObjectDto>> {
    return this.http.get<Array<RentedObjectDto>>(`/api/apartments/${id}/rented-objects/meters`);
  }

  saveMeter(meter: MeterDto): Observable<MeterDto> {
    return this.http.post<MeterDto>(`/api/meter`, meter);
  }

  getMeterDto(id: number): Observable<MeterDto> {
    return this.http.get<MeterDto>(`/api/meter/` + id);
  }

  updateMeter(meter: MeterDto) {
    return this.http.put<MeterDto>(`/api/meter`, meter);
  }

}
