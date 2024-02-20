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
import { NgOtpInputConfig } from 'ng-otp-input';

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
      'border-color': 'initial'
    },
    containerStyles:{
      'display':'flex',
      'justify-content': 'center',
      'padding-top': '20px'
    },
    inputClass:'each_input',
    containerClass:'all_inputs'
  };
  
  emailError: string | null = null;

  constructor(
    private registerService: RegisterService,
    private jwtService: JwtService,
    private router: Router,
    private translate: TranslateService) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ]+$")]),
      lastname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ]+$")]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(60)]),
      mfaEnabled: new FormControl(false),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\\[\\]{}:;',?/*~$^+=<>]).{8,64}$"),
        Validators.maxLength(64)
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

  onOtpChange(value: string): void {
    this.otpCode = value;
    this.otpLength = value.length;
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
  
  register() {
    if (this.registerForm.valid) {
      this.registerService.register(this.registerForm.value)
      .pipe(takeUntil(this.killer$))
      .subscribe({
        next: response => {
          if (!response.mfaEnabled && response.landlordAccess) {
            this.jwtService.setAccessToken(response.accessToken as string);
            this.jwtService.setRefreshToken(response.refreshToken as string);
            this.router.navigate(["/dashboard"])
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
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  verifyTfa() {
    const verifyRequest: VerificationRequestDto = {
      email: this.registerForm.value.email,
      code: this.otpCode
    };
    this.registerService.verifyCode(verifyRequest)
      .pipe(takeUntil(this.killer$))
      .subscribe({
        next: (response) => {
          if (response.landlordAccess) {
            this.jwtService.setAccessToken(response.accessToken as string);
            this.jwtService.setRefreshToken(response.refreshToken as string);
            this.router.navigate(["/dashboard"])
          }
        },
        error: () => {
          this.invalidCode = true;
          this.updateInputStyles();
        }
      })
  }

  getPasswordErrorMsg() {
    if (this.password?.hasError('pattern')) {
      return 'Minimum 8 znaków, duża litera, cyfra, znak specjalny';
    } else if (this.password?.hasError('required')) {
      return 'Wartość wymagana';
    } else if (this.password?.hasError('maxlength')) {
      return 'Maksymalnie 64';
    }
    return '';
  }

  getRepeatPasswordErrorMsg() {
    if (this.repeatPassword?.hasError('passwordMatchError')) {
      return 'Hasła muszą być identyczne';
    } else if (this.repeatPassword?.hasError('required')) {
      return 'Wartość wymagana';
    }
    return '';
  }

  getEmailErrorMessage() {
    if (this.email?.hasError('email')) {
      return 'Nieprawidłowy format e-mail'
    } else if (this.email?.hasError('server')) {
      return this.emailError;
    } else if (this.email?.hasError('maxlength')) {
      return 'Maksymalnie 60'
    } else if (this.email?.hasError('required')) {
      return 'Wartość wymagana'
    }
    return '';
  }

  getFirstNameErrorMsg() {
    if (this.firstname?.hasError('required')) {
      return 'Wartość wymagana'
    }
    if (this.firstname?.hasError('minlength')) {
      return 'Minimalnie 2';
    }
    if (this.firstname?.hasError('maxlength')) {
      return "Maksymalnie 50";
    }
    if (this.firstname?.hasError('pattern')) {
      return 'Niepoprawny format';
    }
    return '';
  }

  getLastNameErrorMsg() {
    if (this.lastname?.hasError('required')) {
      return 'Wartość wymagana'
    }
    if (this.lastname?.hasError('minlength')) {
      return 'Minimalnie 2';
    }
    if (this.lastname?.hasError('maxlength')) {
      return "Maksymalnie 50";
    }
    if (this.lastname?.hasError('pattern')) {
      return 'Niepoprawny format';
    }
    return '';
  }


  updateInputStyles() {
    if (this.otpConfig.inputStyles) {
      this.otpConfig.inputStyles['border-color'] = this.invalidCode ? 'red' : 'initial';
    } else {
      this.otpConfig.inputStyles = {
        'display': 'flex',
        'border-color': this.invalidCode ? 'red' : 'initial'
      };
    }
  }


  get firstname() {
    return this.registerForm.get("firstname");
  }

  get lastname() {
    return this.registerForm.get("lastname");
  }

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }

  get repeatPassword() {
    return this.registerForm.get("repeatPassword");
  }

}
