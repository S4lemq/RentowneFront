import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '../common/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from './user.service';
import { UserDto } from './model/user-dto';
import { matchpassword } from '../common/validators/match-password.validators';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageService } from '../common/service/image.service';
import { ProfileUpdateService } from './profile-update.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy, BaseComponent {
  private killer$ = new Subject<void>();
  
  form!: FormGroup;
  imageForm!: FormGroup;
  isFormSubmitted: boolean = false;
  hide = true;
  isFormValid = () => (this.isFormSubmitted || !this.form?.dirty) && !this.imageSelected
  userId?: number;
  requredFileTypes = "image/jpeg, image/png";
  image: string | null = null;
  imageSelected: boolean = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private imageService: ImageService,
    private profileUpdateService: ProfileUpdateService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ]+$")]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ]+$")]),
      email: new FormControl({value: '', disabled: true}),
      password: new FormControl(null, [
        Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\\[\\]{}:;',?/*~$^+=<>]).{8,64}$"),
        Validators.maxLength(64)
      ]),
      repeatPassword: new FormControl(null),
      changePassword: new FormControl(false),
      file: new FormControl('')
      },
      { validators:matchpassword });
      this.form.get('password')?.valueChanges
      .pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.form.get('repeatPassword')?.updateValueAndValidity();
      });

      this.getUser();
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  getUser() {
    this.userService.getUser()
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.mapFormValues(data);
    })
  }

  submit() {
    if (this.form.valid) {
      this.isFormSubmitted = true;
      if (this.imageSelected) {
        this.imageSelected = false;
        let formData = new FormData();
        formData.append('file', this.fileControl?.value);
        this.imageService.uploadImage(formData)
          .subscribe(result => {
            this.image = result.filename;
            this.userService.updateUser(
              {
                id: this.userId,
                firstname: this.firstname?.value,
                lastname: this.lastname?.value,
                password: this.password?.value,
                repeatPassword: this.repeatPassword?.value,
                image: result.filename,
              } as UserDto,
            ).pipe(takeUntil(this.killer$))
            .subscribe(() => {
              this.profileUpdateService.changeProfileImage(result.filename);
              const translatedText = this.translateService.instant("snackbar.userSaved");
              this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
            });
          });
      } else {
        this.userService.updateUser(
          {
            id: this.userId,
            firstname: this.firstname?.value,
            lastname: this.lastname?.value,
            password: this.password?.value,
            repeatPassword: this.repeatPassword?.value,
            image: this.image
          } as UserDto,
        ).pipe(takeUntil(this.killer$))
        .subscribe(() => {
          const translatedText = this.translateService.instant("snackbar.userSaved");
          this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  mapFormValues(data: UserDto): void {
    this.form.patchValue({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email
    });
    this.userId = data.id;
    this.image = data.image;
  }


  onFileChange(event: any){
    if(event.target.files.length > 0){
      this.imageSelected = true;
      this.form.patchValue({
        file: event.target.files[0]
      });
    }
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

  get firstname() {
    return this.form.get("firstname");
  }

  get lastname() {
    return this.form.get("lastname");
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  get repeatPassword() {
    return this.form.get("repeatPassword");
  }

  get changePassword() {
    return this.form.get("changePassword");
  }

  get fileControl() {
    return this.form.get("file");
  }

}
