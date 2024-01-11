import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApartmentDto } from '../apartment-edit/model/apartment-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartmentAddService {

  constructor(private http: HttpClient) { }

  saveNewApartment(apartment: ApartmentDto): Observable<ApartmentDto> {
    return this.http.post<ApartmentDto>("/api/apartments", apartment);
  }

}
