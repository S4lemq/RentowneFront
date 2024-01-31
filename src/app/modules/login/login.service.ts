import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationRequestDto } from './model/authentication-request';
import { AuthenticationResponseDto } from './model/authentication-response';
import { VerificationRequestDto } from '../register/model/register-verify-code';
import { LostPasswordRequest } from './model/lost-password-request';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(credentials: AuthenticationRequestDto): Observable<AuthenticationResponseDto> {
    return this.http.post<AuthenticationResponseDto>("/api/auth/authenticate", credentials);
  }

  verifyCode(verify: VerificationRequestDto): Observable<AuthenticationResponseDto> {
    return this.http.post<AuthenticationResponseDto>("/api/auth/verify", verify);
  }

  lostPassword(dto: LostPasswordRequest): Observable<any> {
    return this.http.post("/api/lost-password", dto);
  }

  changePassword(passwordObject: any): Observable<any> {
    return this.http.post("/api/change-password", passwordObject);
  }
    
    
}
