import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  setAccessToken(token: string) {
    localStorage.setItem("accessToken", token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  setRefreshToken(token: string) {
    localStorage.setItem("refreshToken", token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  isLoggedIn(): boolean {
    let token = localStorage.getItem("accessToken");
    return token != null && this.notExpired(token);
  }

  private notExpired(token: string): boolean {
    let tokenDecoded = jwt_decode<any>(token);
    return (tokenDecoded.exp * 1000) > new Date().getTime();
  }

}
