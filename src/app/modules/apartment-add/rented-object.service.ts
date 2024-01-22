import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentedObjectService {

  constructor(private http: HttpClient) { }

  getAllRentedObjects(): Observable<Array<RentedObjectDto>> {
    return this.http.get<Array<RentedObjectDto>>(`/api/rented-objects/all`);
  }
}
