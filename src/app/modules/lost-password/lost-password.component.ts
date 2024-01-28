import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { matchpassword } from '../common/validators/match-password.validators';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.scss']
})
export class LostPasswordComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();  
  formGroup!: FormGroup;
  formGroupChangePassword!: FormGroup;
  hash = "";
  hide = true;

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.formGroupChangePassword = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\\[\\]{}:;',?/*~$^+=<>]).{8,64}$"),
        Validators.maxLength(64)
      ]),
      repeatPassword: new FormControl(null, [Validators.required])
    },
    { validators:matchpassword });
    this.formGroupChangePassword.get('password')?.valueChanges
    .pipe(takeUntil(this.killer$))
    .subscribe(() => {
      this.formGroupChangePassword.get('repeatPassword')?.updateValueAndValidity();
    });

    this.hash = this.activatedRoute.snapshot.params['hash'];
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }


  send(){
    if (this.formGroup.valid) {
      this.loginService.lostPassword(this.formGroup.value)
      .pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.router.navigate(["/login"])
        .then(() => this.snackBar.open('Email z linkiem został wysłany', '', {duration: 3000, panelClass: ['snackbarSuccess']}));
      })
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  sendChangePassword(){
    if (this.formGroupChangePassword.valid) {
      this.loginService.changePassword({
        password: this.formGroupChangePassword.get("password")?.value,
        repeatPassword: this.formGroupChangePassword.get("repeatPassword")?.value,
        hash: this.hash
      }).pipe(takeUntil(this.killer$))
      .subscribe({
        next: () => {
          this.formGroupChangePassword.reset();
          this.snackBar.open('Hasło zostało zmienione', '', {duration: 3000, panelClass: ['snackbarSuccess']});
        }
    });

    }
  }

  getPasswordErrorMsg() {
    const passwordControl = this.password;
    if (passwordControl) {
      if (passwordControl.hasError('pattern')) {
        return 'Minimum 8 znaków, duża litera, cyfra, znak specjalny';
      } else if (passwordControl.hasError('required')) {
        return 'Wartość wymagana';
      } else if (passwordControl.hasError('maxlength')) {
        return 'Maksymalnie 64';
      }
    }
    return '';
  }

  getRepeatPasswordErrorMsg() {
    const repeatPasswordControl = this.repeatPassword;
    if (repeatPasswordControl) {
      if (repeatPasswordControl.hasError('passwordMatchError')) {
        return 'Hasła muszą być identyczne';
      } else if (repeatPasswordControl.hasError('required')) {
        return 'Wartość wymagana';
      }
    }
    return '';
  }


  getEmailErrorMsg() {
    const emailControl = this.email;
    if (emailControl) {
      if (emailControl.hasError('email')) {
        return 'Nieprawidłowy format e-mail';
      } else if (emailControl.hasError('required')) {
        return 'Wartość wymagana';
      }
    }
    return '';
  }
    
  get email() {
    return this.formGroup.get("email");
  }

  get password() {
    return this.formGroupChangePassword.get("password");
  }

  get repeatPassword() {
    return this.formGroupChangePassword.get("repeatPassword");
  }

}
