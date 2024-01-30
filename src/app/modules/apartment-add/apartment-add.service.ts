import { HttpClient, HttpParams } from '@angular/common/http';
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

  getAllApartments(apartmentId?: number): Observable<Array<ApartmentDto>> {
    let params = new HttpParams();
    if (apartmentId !== undefined) {
      params = params.set('apartmentId', apartmentId.toString());
    }

    return this.http.get<Array<ApartmentDto>>("/api/apartments/all-by-logged-user", { params });
  }

}
