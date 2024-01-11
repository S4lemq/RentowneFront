import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApartmentDto } from './model/apartment-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartmentEditService {

  constructor(private http: HttpClient) { }

  getApartment(id: number): Observable<ApartmentDto> {
    return this.http.get<ApartmentDto>("/api/apartments/" + id);
  }

  savePost(id: number, value: ApartmentDto) {
    return this.http.put<ApartmentDto>("/api/apartments/" + id, value);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>("/api/apartments/" + id);
  }
}
