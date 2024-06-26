import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { JwtService } from '../common/service/jwt.service';
import { Router } from '@angular/router';
import { AuthenticationRequestDto } from './model/authentication-request';
import { AuthenticationResponseDto } from './model/authentication-response';
import { VerificationRequestDto } from '../register/model/register-verify-code';
import { NgOtpInputConfig } from 'ng-otp-input';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;
  authRequest: AuthenticationRequestDto = {};
  otpCode = '';
  authResponse: AuthenticationResponseDto = {};
  hide = true;
  invalidCode: boolean = false;
  otpLength: number = 0;

  otpConfig: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles:{
      'display':'flex',
      'border-color': '#858585',
      'width': '40px',
      'height': '40px',
      'font-size': '24px',
    },
    containerStyles:{
      'display':'flex',
      'justify-content': 'center',
      'padding-top': '20px'
    },
    inputClass:'each_input',
    containerClass:'all_inputs'
  };

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private jwtService: JwtService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onOtpChange(value: string): void {
    this.otpCode = value;
    this.otpLength = value.length;
  }

  submit() {
    if (this.email && this.password) {
      if (!this.email.hasError('email') && !this.email.hasError('required') && !this.password.hasError('required')) {
        this.loginService.login(this.formGroup.value)
        .subscribe({
          next: (response) => {
            if(response.landlordAccess && !response.mfaEnabled) {
              this.jwtService.setAccessToken(response.accessToken as string);
              this.jwtService.setRefreshToken(response.refreshToken as string);
              this.setDefaultLanguage(response.preferredLanguage as string);
              this.router.navigate(["/dashboard"]);
            } else if (response.landlordAccess && !this.authResponse.mfaEnabled) {
              this.authResponse = response;
            } else {
              this.password?.setErrors({ server: true });//bo użytkownik z rolą USER próbował się zalogować na konto ADMIN
            }
          },
          error: err => {
            this.formGroup.controls['password'].setErrors({ server: true }); // Ustawienie błędu pochodzącego z serwera na kontrolce formularza
          }
        })
      }
    }
  }

  verifyCode() {
    const verifyRequest: VerificationRequestDto = {
      email: this.formGroup.value.email,
      code: this.otpCode
    };
    this.loginService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
            if (response.landlordAccess) {
              this.jwtService.setAccessToken(response.accessToken as string);
              this.jwtService.setRefreshToken(response.refreshToken as string);
              this.router.navigate(["/dashboard"]);
            }
        },
        error: () => {
          this.invalidCode = true;
          this.updateInputStyles();
        }
      })
  }

  setDefaultLanguage(name: string) {
    if (name === 'POLISH') {
      localStorage.setItem('preferredLanguage', 'pl');
      this.translateService.use('pl');
    } else if (name === 'ENGLISH') {
      localStorage.setItem('preferredLanguage', 'en');
      this.translateService.use('en');
    } else if (name === 'UKRAINIAN') {
      localStorage.setItem('preferredLanguage', 'uk');
      this.translateService.use('uk');
    }
  }

  updateInputStyles() {
    if (this.otpConfig.inputStyles) {
      this.otpConfig.inputStyles['border-color'] = this.invalidCode ? 'red' : '#858585';
    } else {
      this.otpConfig.inputStyles = {
        'display': 'flex',
        'border-color': this.invalidCode ? 'red' : '#858585',
      };
    }
  }

  getErrorClass(): string {
    let styleClass = '';
    if (this.invalidCode) {
      styleClass = 'error-code-visible';
    } else {
      styleClass = 'error-code-empty';
    }
    return styleClass;
  }

  getEmailErrorMsg() {
    if (this.email?.hasError('email')) {
      return 'Nieprawidłowy format e-mail';
    } else if (this.email?.hasError('required')) {
      return 'Wartość wymagana';
    }
    return '';
  }

  getPasswordErrorMsg() {
    if (this.password?.hasError('required')) {
      return 'Wartość wymagana';
    } else if (this.password?.hasError('server')) {
        // Ustawienie błędu 'invalid' na kontrolce email
        this.email?.setErrors({ invalid: true });
      return 'Nieprawidłowy adres e-mail lub hasło';
    }
    return '';
  }

  get email() {
    return this.formGroup.get("email");
  }

  get password() {
    return this.formGroup.get("password");
  }

}
