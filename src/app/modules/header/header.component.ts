import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { languages, notifications, userItems } from './header-dummy-data';
import { LogoutService } from '../login/logout.service';
import { Router } from '@angular/router';
import { UserService } from '../profile-edit/user.service';
import { Subject, takeUntil } from 'rxjs';
import { ProfileUpdateService } from '../profile-edit/profile-update.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  [x: string]: any;

  @Input() collapsed = false;
  @Input() screenWidth = 0;
  canShowSearchAsOverlay = false;
  selectedLanguage: any;
  isFullScreen: boolean = false;
  private killer$ = new Subject<void>();
  profileImage!: string;

  languages = languages;
  notifications = notifications;
  userItems = userItems;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  constructor(
    private logoutService: LogoutService,
    private userService: UserService,
    private router: Router,
    private profileUpdateService: ProfileUpdateService
  ) {}

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
    this.userService.getUserProfileImage()
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.profileImage = data;
    });
    this.profileUpdateService.currentProfileImage
    .pipe(takeUntil(this.killer$))
    .subscribe(image => {
      if (image) {
        this.profileImage = image;
      }
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  onMenuClick(itemLabel: string) {
    if (itemLabel === 'Wyloguj') {
      this.logoutService.logout()
      .pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.router.navigate(['/login']);
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
      });
    } else if (itemLabel === 'Profil') {
      this.router.navigate(['profile/edit']);
    }
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }

  toggleFullScreen() {
    let doc: any = document; // Tutaj przekształcamy 'document' na 'any'
  
    if (!doc.fullscreenElement) {
      let elem = doc.documentElement;
  
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari, Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
      this.isFullScreen = true;
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) { /* Firefox */
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) { /* Chrome, Safari, Opera */
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { /* IE/Edge */
        doc.msExitFullscreen();
      }
      this.isFullScreen = false;
    }
  }
  
  
  
  
}
