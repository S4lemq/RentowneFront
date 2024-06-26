import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequestDto } from './model/register-request';
import { RegisterResponseDto } from './model/register-response';
import { VerificationRequestDto } from './model/register-verify-code';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(register: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>("/api/auth/register", register);
  }

  verifyCode(verify: VerificationRequestDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>("/api/auth/verify", verify);
  }
}
