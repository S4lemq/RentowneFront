import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApartmentDto {
  country: string;
  street: string;
}


@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  constructor(private http: HttpClient) { }

  getAvailableApartmentNames(): Observable<ApartmentDto> {
    return this.http.get<ApartmentDto>("/api/apartments");
  }
}
