import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { languages, notifications, userItems, messages } from './header-dummy-data';
import { LogoutService } from '../login/logout.service';
import { Router } from '@angular/router';
import { UserService } from '../profile-edit/user.service';
import { Subject, takeUntil } from 'rxjs';
import { ProfileUpdateService } from '../profile-edit/profile-update.service';
import { TranslateService } from '@ngx-translate/core';
import { lang } from 'moment';

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
  messages = messages;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  constructor(
    private logoutService: LogoutService,
    private userService: UserService,
    private router: Router,
    private profileUpdateService: ProfileUpdateService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);

    this.userService.getUserProfileImageAndLang()
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.profileImage = data.image;
      const language = data.preferredLanguage
      if (language === 'POLISH') {
        this.selectedLanguage = this.languages[0];
      } else if (language === 'ENGLISH') {
        this.selectedLanguage = this.languages[1];
      } else if (language === 'UKRAINIAN') {
        this.selectedLanguage = this.languages[2];
      }
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

  onMenuClick(name: string) {
    if (name === 'log-out') {
      this.logoutService.logout()
      .pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.router.navigate(['/login']);
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
      });
    } else if (name === 'profile') {
      this.router.navigate(['profile/edit']);
    }
  }

  onLanguageClick(name: string) {
    if (name === 'POLISH') {
      localStorage.setItem('preferredLanguage', 'pl');
      this.translateService.use('pl');
      this.selectedLanguage = this.languages[0];
    } else if (name === 'ENGLISH') {
      localStorage.setItem('preferredLanguage', 'en');
      this.translateService.use('en');
      this.selectedLanguage = this.languages[1];
    } else if (name === 'UKRAINIAN') {
      localStorage.setItem('preferredLanguage', 'uk');
      this.translateService.use('uk');
      this.selectedLanguage = this.languages[2];
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
