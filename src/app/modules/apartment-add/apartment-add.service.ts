import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApartmentEditDto } from '../apartment-edit/model/apartment-edit-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartmentAddService {

  constructor(private http: HttpClient) { }

  saveNewApartment(apartment: ApartmentEditDto): Observable<ApartmentEditDto> {
    return this.http.post<ApartmentEditDto>("/api/apartments", apartment);
  }

}
