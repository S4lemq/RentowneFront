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
  loginError = false;
  authRequest: AuthenticationRequestDto = {};
  otpCode = '';
  authResponse: AuthenticationResponseDto = {};

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
    if(this.formGroup.valid) {
      this.loginService.login(this.formGroup.value)
      .subscribe({
        next: (response) => {
          this.loginError = false;
          if(!response.landlordAccess && !response.mfaEnabled) {
            this.jwtService.setAccessToken(response.accessToken as string);
            this.jwtService.setRefreshToken(response.refreshToken as string);
            this.router.navigate([this.REDIRECT_ROUTE]);
          } else if (!response.landlordAccess && !this.authResponse.mfaEnabled) {
            this.authResponse = response;
          } else {
            this.loginError = true;
          }
        },
        error: () => this.loginError = true
      });
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

}

