import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApartmentEditDto } from './model/apartment-edit-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartmentEditService {

  constructor(private http: HttpClient) { }

  getApartment(id: number): Observable<ApartmentEditDto> {
    return this.http.get<ApartmentEditDto>("/api/apartments/" + id);
  }

  savePost(id: number, value: ApartmentEditDto) {
    return this.http.put<ApartmentEditDto>("/api/apartments/" + id, value);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>("/api/apartments/" + id);
  }
}
