
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
  })
  export class LogoutService {
  
    constructor(private http: HttpClient) { }
  
    logout(): Observable<void> {
        return this.http.post<void>("/api/auth/logout", {});
    }
    
  }
  