import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationRequestDto } from './model/authentication-request';
import { AuthenticationResponseDto } from './model/authentication-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(credentials: AuthenticationRequestDto): Observable<AuthenticationResponseDto> {
    return this.http.post<AuthenticationResponseDto>("/api/auth/authenticate", credentials);
  }
}
