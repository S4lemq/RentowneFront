import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationRequestDto } from '../../login/model/authentication-request';
import { Observable } from 'rxjs';
import { AuthenticationResponseDto } from '../../login/model/authentication-response';

@Injectable({
  providedIn: 'root'
})
export class TenanLoginService {

  constructor(private http: HttpClient) { }

  login(credentials: AuthenticationRequestDto): Observable<AuthenticationResponseDto> {
    return this.http.post<AuthenticationResponseDto>("/api/auth/authenticate", credentials);
  }
}
