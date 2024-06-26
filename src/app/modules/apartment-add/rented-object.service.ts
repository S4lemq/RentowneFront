import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';

@Injectable({
  providedIn: 'root'
})
export class RentedObjectService {

  constructor(private http: HttpClient) { }

  getAllRentedObjects(): Observable<Array<RentedObjectDto>> {
    return this.http.get<Array<RentedObjectDto>>(`/api/rented-objects/all`);
  }

  getAllRentedObjectsByLoggedUser(id: number, rentedObjectId?: number): Observable<Array<RentedObjectDto>> {
    let params = new HttpParams();
    if (rentedObjectId !== undefined) {
      params = params.set('rentedObjectId', rentedObjectId.toString());
    }
    return this.http.get<Array<RentedObjectDto>>("/api/apartments/" + id + "/rented-objects/all", { params });
  }
}
