import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from './model/user-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(): Observable<UserDto> {
    return this.http.get<UserDto>("/api/users");
  }

  updateUser(dto: UserDto) {
    return this.http.put<UserDto>(`/api/users`, dto);
  }

  getUserProfileImage(): Observable<string> {
    return this.http.get("/api/users/profile-image", { responseType: 'text' });
  }
}
