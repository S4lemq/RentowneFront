import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../login/login.service';
import { JwtService } from '../../common/service/jwt.service';
import { Router } from '@angular/router';
import { AuthenticationRequestDto } from '../../login/model/authentication-request';
import { AuthenticationResponseDto } from '../../login/model/authentication-response';
import { VerificationRequestDto } from '../../register/model/register-verify-code';

@Component({
  selector: 'app-tenant-login',
  templateUrl: './tenant-login.component.html',
  styleUrls: ['./tenant-login.component.scss']
})
export class TenantLoginComponent implements OnInit {

  private readonly REDIRECT_ROUTE = "tenant/profile";
  formGroup!: FormGroup;
  authRequest: AuthenticationRequestDto = {};
  otpCode = '';
  authResponse: AuthenticationResponseDto = {};
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private jwtService: JwtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.jwtService.isLoggedIn()) {
      this.router.navigate([this.REDIRECT_ROUTE]);
    }

    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.email && this.password) {
      if (!this.email.hasError('email') && !this.email.hasError('required') && !this.password.hasError('required')) {
        this.loginService.login(this.formGroup.value)
        .subscribe({
          next: (response) => {
            if(!response.landlordAccess && !response.mfaEnabled) {
              this.jwtService.setAccessToken(response.accessToken as string);
              this.jwtService.setRefreshToken(response.refreshToken as string);
              this.router.navigate([this.REDIRECT_ROUTE]);
            } else if (!response.landlordAccess && !this.authResponse.mfaEnabled) {
              this.authResponse = response;
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
              this.router.navigate([this.REDIRECT_ROUTE]);
            }
        }
      })
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

