import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileUpdateService {
  private profileImageSource = new BehaviorSubject<string | null>(null);
  currentProfileImage = this.profileImageSource.asObservable();

  constructor() { }

  changeProfileImage(image: string) {
    this.profileImageSource.next(image);
  }
}
