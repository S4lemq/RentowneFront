import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { JwtService } from '../common/service/jwt.service';
import { Router } from '@angular/router';
import { AuthenticationRequestDto } from './model/authentication-request';
import { AuthenticationResponseDto } from './model/authentication-response';
import { VerificationRequestDto } from '../register/model/register-verify-code';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup!: FormGroup;
  loginError = false;
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
            if(response.landlordAccess && !response.mfaEnabled) {
              this.jwtService.setAccessToken(response.accessToken as string);
              this.jwtService.setRefreshToken(response.refreshToken as string);
              this.router.navigate([""]);//przekierowanie do głównego panelu, jak chcesz to możesz do np (["/apartments"])
            } else if (response.landlordAccess && !this.authResponse.mfaEnabled) {
              this.authResponse = response;
            } else {
              this.loginError = true;//bo nie jest userem tylko adminem
            }
          },
          error: () => this.loginError = true
        })
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
              this.router.navigate([""]);//przekierowanie do głównego panelu, jak chcesz to możesz do np (["/apartments"])
            }
        }
      })
  }

}
