import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { JwtService } from '../common/service/jwt.service';
import { matchpassword } from '../common/validators/match-password.validators';
import { RegisterRequestDto } from './model/register-request';
import { RegisterResponseDto } from './model/register-response';
import { VerificationRequestDto } from './model/register-verify-code';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private killer$: Subject<void> = new Subject<void>()
  registerForm!: FormGroup;
  registerError = false;
  registerRequest: RegisterRequestDto = {};
  registerResponse: RegisterResponseDto = {};
  otpCode = '';
  tfaCodeMessage: string = "";
  hide = true;
  
  emailError: string | null = null;

  constructor(
    private registerService: RegisterService,
    private jwtService: JwtService,
    private router: Router,
    private translate: TranslateService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstname: new FormControl(null, [Validators.required]),
      lastname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mfaEnabled: new FormControl(false),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\\[\\]{}:;',?/*~$^+=<>]).{8,64}$")
      ]),
      repeatPassword: new FormControl(null, [Validators.required])
      },
      { validators:matchpassword });
      this.registerForm.get('password')?.valueChanges
      .pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.registerForm.get('repeatPassword')?.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }
  
  register() {
    if (this.registerForm.invalid) {
      this.registerForm.get('repeatPassword')?.markAsTouched();
      return;
    } 
    if (this.registerForm.valid) {
      this.registerService.register(this.registerForm.value)
      .pipe(takeUntil(this.killer$))
      .subscribe({
        next: response => {
          if (!response.mfaEnabled && response.landlordAccess) {
            this.jwtService.setAccessToken(response.accessToken as string);
            this.jwtService.setRefreshToken(response.refreshToken as string);
            this.router.navigate(["/"])
          } else {
            this.registerResponse = response;
          }
      },
        error: err => {
          if (err.error?.field === 'email') {
            this.emailError = `server.error.${err.error.code}`;
            this.translate.get(this.emailError).pipe(takeUntil(this.killer$)).subscribe((translatedMessage: string) => {
              this.emailError = translatedMessage;
            });
            this.registerForm.controls['email'].setErrors({ server: true }); // Ustawienie błędu pochodzącego z serwera na kontrolce formularza
          }
        }
      });
    }
  }

  verifyTfa() {
    this.tfaCodeMessage = "";
    const verifyRequest: VerificationRequestDto = {
      email: this.registerForm.value.email,
      code: this.otpCode
    };
    this.registerService.verifyCode(verifyRequest)
      .pipe(takeUntil(this.killer$))
      .subscribe({
        next: (response) => {
          this.tfaCodeMessage = "Konto zostało utworzone, za chwilę zostaniesz przekierowany na stronę główną"
          setTimeout(() => {
            if (response.landlordAccess) {
              this.jwtService.setAccessToken(response.accessToken as string);
              this.jwtService.setRefreshToken(response.refreshToken as string);
              this.router.navigate(["/"])
            }
          }, 3000)
        }
      })
  }

  getEmailErrorMessage() {
    const emailControl = this.registerForm.get('email');
    if (emailControl) {
      if (emailControl.hasError('email')) {
        return this.translate.instant('register.error.email');
      } else if (emailControl.hasError('server')) {
        return this.emailError;
      }
    }
    return '';
  }

}
