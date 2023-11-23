import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  setAccessToken(token: string) {
    sessionStorage.setItem("accessToken", token);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem("accessToken");
  }

  setRefreshToken(token: string) {
    sessionStorage.setItem("refreshToken", token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem("refreshToken");
  }

  isLoggedIn(): boolean {
    let token = sessionStorage.getItem("accessToken");
    return token != null && this.notExpired(token);
  }

  isLandLord(): boolean {
    let token = <string>sessionStorage.getItem("accessToken");
    let tokenDecoded = jwt_decode<any>(token);
    return tokenDecoded.landlordAccess;
  }

  private notExpired(token: string): boolean {
    let tokenDecoded = jwt_decode<any>(token);
    return (tokenDecoded.exp * 1000) > new Date().getTime();
  }

}
