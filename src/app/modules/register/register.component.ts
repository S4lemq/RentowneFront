import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { JwtService } from '../common/service/jwt.service';
import { Router } from '@angular/router';
import { VerificationRequestDto } from './model/register-verify-code';
import { RegisterRequestDto } from './model/register-request';
import { RegisterResponseDto } from './model/register-response';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registerError = false;
  registerErrorMessage = "";
  registerRequest: RegisterRequestDto = {};
  registerResponse: RegisterResponseDto = {};
  otpCode = '';
  tfaCodeMessage: string = "";

  emailError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private jwtService: JwtService,
    private router: Router,
    private translate: TranslateService) {}

    switchLanguage(language: string) {
      this.translate.use(language);
    }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      mfaEnabled: [false]
    });
  }

  register() {
    if (this.registerForm.valid && this.isPasswordIdentical(this.registerForm.value)) {
      this.registerService.register(this.registerForm.value)
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
          if (err && err.error && err.error.field === 'email') {
            // Jeśli backend zwróci błąd dla pola e-mail, ustaw stan błędu
            this.emailError = err.error.message || 'Błąd związany z e-mail';
          } else {
            // Dla innych błędów, ustaw ogólny komunikat błędu
            this.emailError = 'Wystąpił błąd podczas rejestracji. Proszę spróbować ponownie.';
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

  private isPasswordIdentical(register: any): boolean {
    if (register.password === register.repeatPassword) {
      this.registerError = false;
      return true;
    }
    this.registerError = true;
    this.registerErrorMessage = "Hasła nie są identyczne";
    return false;
  }

}
