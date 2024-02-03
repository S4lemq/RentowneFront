import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeterReadingDto } from './model/meter-reading-dto';
import { MeterDto } from '../meter-edit/model/meter-dto';

@Injectable({
  providedIn: 'root',
})
export class MeterReadingService {
  constructor(private http: HttpClient) {}

  getMeterReadingByMeter(meterId: number): Observable<MeterReadingDto> {
    return this.http.get<MeterReadingDto>(
      `/api/meter/${meterId}/prev-meter-reading`
    );
  }

  saveMeterReading(meterReading: MeterReadingDto): Observable<any> {
    return this.http.post<MeterReadingDto>(`/api/meter-reading`, meterReading);
  }
}
