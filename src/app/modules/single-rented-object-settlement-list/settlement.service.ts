import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {

  constructor(private http: HttpClient) { }

  calculate(id: number, waterIncluded: boolean, electricityIncluded: boolean): Observable<void> {
    let params = new HttpParams();
    if (waterIncluded !== undefined) {
      params = params.set('waterIncluded', waterIncluded.toString());
    }
    if (electricityIncluded !== undefined) {
      params = params.set('electricityIncluded', electricityIncluded.toString());
    }
    return this.http.get<void>("/api/rented-objects/" + id + "/calculate", { params });
  }
}
