import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { BaseComponent } from '../common/base.component';
import { ImageService } from '../common/service/image.service';
import { formatCardNumber, formatExpiryDate } from '../common/utils';
import { matchpassword } from '../common/validators/match-password.validators';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ImageDataDto } from './model/image-data';
import { PaymentCardDto } from './model/payment-card-dto';
import { UserDto } from './model/user-dto';
import { ProfileUpdateService } from './profile-update.service';
import { UserService } from './user.service';
import { PreferedLanguage } from '../login/model/prefered-language';

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
  oldPasswordHide = true;
  passwordHide = true;
  repeatPasswordHide = true;
  userId?: number;
  paymentCardId?: number;
  addressId?: number;
  requredFileTypes = "image/jpeg, image/png";
  image: string | null = null;
  imageSelected: boolean = false;
  languages = Object.values(PreferedLanguage);

  file: string = '';
  changePasswordControl = new FormControl(false);

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private imageService: ImageService,
    private profileUpdateService: ProfileUpdateService,
    private dialog: MatDialog
  ) {}

  isFormValid(): boolean {
    return (this.isFormSubmitted || !this.form?.dirty) && !this.imageSelected;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ]+$")]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern("^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ]+$")]),
      email: new FormControl({value: '', disabled: true}),
      oldPassword: new FormControl(null),
      password: new FormControl(null, [
        Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–\\[\\]{}:;',?/*~$^+=<>]).{8,64}$"),
        Validators.maxLength(64)
      ]),
      repeatPassword: new FormControl(null),
      file: new FormControl(''),
      phoneNumber: new FormControl('', [Validators.maxLength(20)]),
      preferedLanguage: new FormControl(''),

      number:  new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.minLength(16)]),
      name: new FormControl('', [this.validName(), Validators.maxLength(100)]),
      month: new FormControl('', [Validators.pattern("^(0[1-9]|1[0-2])$")]),
      year: new FormControl('', [this.validYear()]),
      cvv: new FormControl('', [Validators.pattern("^[0-9]*$"), Validators.minLength(3)]),

      streetName: new FormControl('', [Validators.minLength(4), Validators.maxLength(100)]),
      buildingNumber: new FormControl('', [Validators.minLength(1), Validators.maxLength(10)]),
      apartmentNumber: new FormControl('', [Validators.minLength(1), Validators.maxLength(10)]),
      zipCode: new FormControl('', [Validators.minLength(1), Validators.maxLength(10)]),
      cityName: new FormControl('', [Validators.minLength(4), Validators.maxLength(60)]),
      voivodeship: new FormControl('', [Validators.minLength(4), Validators.maxLength(60)]),
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

  validYear() {
    return (control: AbstractControl): ValidationErrors | null => {
      const now = new Date();
      const currentYearLastTwoDigits = now.getFullYear() % 100;
      const rawValue = control.value;
      if (!rawValue) {
        return null;
      }
  
      // Sprawdzenie, czy wartość zawiera tylko cyfry
      if (!/^\d+$/.test(rawValue)) {
        return { onlyDigits: true };
      }
  
      const value = Number(rawValue);
      const isValidYear =
        !isNaN(value) &&
        value >= currentYearLastTwoDigits &&
        value <= currentYearLastTwoDigits + 3;
  
      const maxYearLastTwoDigits = (currentYearLastTwoDigits + 3) % 100;
      const isCrossingDecade = currentYearLastTwoDigits > maxYearLastTwoDigits;
      if (isCrossingDecade) {
        const validCrossingDecade = value >= 0 && value <= maxYearLastTwoDigits;
        return isValidYear || validCrossingDecade ? null : { validYear: true };
      }
  
      return isValidYear ? null : { validYear: true };
    };
  }
  
  validName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        // Nie dodajemy błędu jeśli pole jest puste, bo Validators.required już to obsługuje
        return null;
      }
      // Sprawdzenie czy wartość składa się tylko z liter (oraz opcjonalnie myślników) i zawiera jedną spację
      const isContentValid = /^[a-zA-Z-]+\s[a-zA-Z-]+$/.test(value);
      // Zwracanie null jeśli wartość jest poprawna, w przeciwnym razie zwracamy obiekt błędu
      if (!isContentValid) {
        return { validName: true };
      }
      return null;
    };
  }

  getUser() {
    this.userService.getUser()
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.mapFormValues(data);
      if (data.image) {
        this.image = data.image; // Przechowuje nazwę pliku obrazu
        this.file = '/api/data/image/' + data.image; // Ustawia URL do wyświetlenia obrazu
      }
    })
  }

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.isFormSubmitted = true;
  
    const userDto: UserDto = this.createUserDto();
  
    if (this.imageSelected) {
      this.handleImageUpload(userDto);
    } else {
      this.updateUserProfile(userDto);
    }
  }

  private createUserDto(): UserDto {
    const addressDto: AddressDto = this.createAddressDto();
    const paymentCardDto: PaymentCardDto = this.createPaymentCardDto();
  
    return {
      id: this.userId,
      firstname: this.firstname?.value,
      lastname: this.lastname?.value,
      oldPassword: this.oldPassword?.value,
      password: this.password?.value,
      repeatPassword: this.repeatPassword?.value,
      image: this.image || '',
      phoneNumber: this.phoneNumber?.value,
      preferredLanguage: this.preferedLanguage?.value,
      paymentCardDto: paymentCardDto,
      addressDto: addressDto
    };
  }
  
  private createAddressDto(): AddressDto {
    return {
      id: this.addressId,
      streetName: this.form.get('streetName')?.value,
      buildingNumber: this.form.get('buildingNumber')?.value,
      apartmentNumber: this.form.get('apartmentNumber')?.value,
      zipCode: this.form.get('zipCode')?.value,
      cityName: this.form.get('cityName')?.value,
      voivodeship: this.form.get('voivodeship')?.value
    };
  }
  
  private createPaymentCardDto(): PaymentCardDto {
    return {
      id: this.paymentCardId,
      number: this.form.get("number")?.value,
      month: this.form.get("month")?.value,
      year: this.form.get("year")?.value,
      name: this.form.get("name")?.value,
      cvv: this.form.get("cvv")?.value
    };
  }
  
  private handleImageUpload(userDto: UserDto) {
    this.imageSelected = false;
    let formData = new FormData();
    formData.append('file', this.fileControl?.value);
  
    this.imageService.uploadImage(formData).subscribe(result => {
      userDto.image = result.filename;
      this.updateUserProfile(userDto, () => this.profileUpdateService.changeProfileImage(result.filename));
    });
  }
  
  private updateUserProfile(userDto: UserDto, additionalSuccessAction?: () => void) {
    this.userService.updateUser(userDto).pipe(takeUntil(this.killer$)).subscribe({
      next: () => {
        if (additionalSuccessAction) additionalSuccessAction();
        this.showSuccessSnackbar();
      },
      error: (err) => this.handleError(err)
    });
  }
  
  private showSuccessSnackbar() {
    const translatedText = this.translateService.instant("snackbar.userSaved");
    this.snackBar.open(translatedText, '', { duration: 3000, panelClass: ['snackbarSuccess'] });
  }
  
  private handleError(err: any) {
    if (err?.error?.code === 'EMPTY_REQUIRED_ADDRESS_FIELDS' || err?.error?.code === 'EMPTY_REQUIRED_PAYMENT_CARD_FIELDS') {
      // Obsługa błędów związanych z adresem oraz kartą płatniczą za pomocą snackbara
      return;
    }
    this.oldPassword?.setErrors({ server: true });
  }

  mapFormValues(data: UserDto): void {
    this.form.patchValue({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      phoneNumber: data.phoneNumber,
      preferedLanguage: data.preferredLanguage,
      number: data.paymentCardDto?.number,
      name: data.paymentCardDto?.name,
      month: data.paymentCardDto?.month,
      year: data.paymentCardDto?.year,
      cvv: data.paymentCardDto?.cvv,
      streetName: data.addressDto?.streetName,
      buildingNumber: data.addressDto?.buildingNumber,
      apartmentNumber: data.addressDto?.apartmentNumber,
      zipCode: data.addressDto?.zipCode,
      cityName: data.addressDto?.cityName,
      voivodeship: data.addressDto?.voivodeship
    });
    this.userId = data.id;
    this.image = data.image;
    this.paymentCardId = data.paymentCardDto?.id;
    this.addressId = data.addressDto?.id;
  } 

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    if (files.length > 0) {
      const originalFile = files[0];
      const _file = URL.createObjectURL(originalFile)
      this.resetInput();
      this.openAvatarEditor({image: _file, fileName: originalFile.name} as ImageDataDto)
        .subscribe(
          (result) => {
            if (result) {
                // result to teraz File, więc tworzymy z niego URL obiektu
                const objectUrl = URL.createObjectURL(result);
                this.file = objectUrl; // Używamy URL obiektu zamiast bezpośredniego pliku
                this.imageSelected = true;
                this.form.patchValue({
                  file: result
                });
            }
          }
        )
    }
  }

  openAvatarEditor(imageData: ImageDataDto): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: imageData,
    });

    return dialogRef.afterClosed();
  }

  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if(input){
      input.value = "";
    }
  }

  getPhoneNumberErrorMsg() {
    if (this.phoneNumber?.errors?.['maxlength']) {
      return 'Maksymalnie 20';
    }
    return null;
  }

  getCvvErrorMsg() {
    if (this.form.get("cvv")?.hasError('pattern')) {
      return 'Tylko cyfry';
    } else if (this.form.get("cvv")?.hasError('minlength')) {
      return 'Wymagane 3 cyfry'
    }
    return '';
  }

  getYearErrorMsg() {
    if (this.form.get('year')?.hasError('validYear')) {
      const currentYearLastTwoDigits = new Date().getFullYear() % 100;
      return (currentYearLastTwoDigits < 10 ? '0' : '') + currentYearLastTwoDigits + ' - ' + 
             ((currentYearLastTwoDigits + 3) % 100);
    } else if (this.form.get('year')?.hasError('onlyDigits')) {
      return 'Tylko cyfry'
    }
    return '';
  }

  getMonthErrorMsg() {
    if (this.form.get("month")?.hasError('pattern')) {
      return 'od 01 do 12';
    }
    return '';
  }

  getCardNumberErrorMsg() {
    if (this.form.get("number")?.hasError('pattern')) {
      return 'Numer karty musi składać się tylko z cyfr';
    } else if (this.form.get("number")?.hasError('minlength')) {
      return 'Numer karty musi składać się z 16 znaków'
    }
    return '';
  }

  getCardNameErrorMsg() {
    if (this.form.get('name')?.hasError('validName')) {
      return 'Wymagane Imię i nazwisko, brak polski znaków, spacja pomiędzy';
    } else if (this.form.get("name")?.hasError('maxlength')) {
      return 'Maksymalnie 100';
    }
    return '';
  }

  getOldPasswordErrorMsg() {
    if (this.oldPassword?.hasError('server')) {
      return 'Nieprawidłowe hasło';
    }
    return '';
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

  getStreetNameErrorMsg() {
    if (this.streetName?.errors?.['minlength']) {
      return 'Minimalnie 4';
    }
    if (this.streetName?.errors?.['maxlength']) {
      return "Maksymalnie 100";
    }
    return null;
  }

  getBuildingNumberErrorMsg() {
    if (this.buildingNumber?.errors?.['minlength']) {
      return 'Minimalnie 1';
    }
    if (this.buildingNumber?.errors?.['maxlength']) {
      return "Maksymalnie 10";
    }
    return null;
  }

  getApartmentNumberErrorMsg() {
    if (this.buildingNumber?.errors?.['minlength']) {
      return 'Minimalnie 1';
    }
    if (this.buildingNumber?.errors?.['maxlength']) {
      return "Maksymalnie 10";
    }
    return null;
  }

  getZipCodeErrorMsg() {
    if (this.zipCode?.errors?.['minlength']) {
      return 'Minimalnie 1';
    }
    if (this.zipCode?.errors?.['maxlength']) {
      return "Maksymalnie 10";
    }
    return null;
  }

  getCityNameErrorMsg() {
    if (this.cityName?.errors?.['minlength']) {
      return 'Minimalnie 4';
    }
    if (this.cityName?.errors?.['maxlength']) {
      return "Maksymalnie 60";
    }
    return null;
  }

  getVoivodeshipErrorMsg() {
    if (this.voivodeship?.errors?.['minlength']) {
      return 'Minimalnie 4';
    }
    if (this.voivodeship?.errors?.['maxlength']) {
      return "Maksymalnie 60";
    }
    return null;
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

  get oldPassword() {
    return this.form.get("oldPassword");
  }

  get password() {
    return this.form.get("password");
  }

  get repeatPassword() {
    return this.form.get("repeatPassword");
  }

  get changePassword() {
    return this.changePasswordControl;
  }

  get fileControl() {
    return this.form.get("file");
  }

  get cardNumber() {
    return formatCardNumber(this.form.get("number")?.value);
  }

  get cardExpiryMonth() {
    return formatExpiryDate(this.form.get("month")?.value);
  }

  get cardExpiryYear() {
    return formatExpiryDate(this.form.get("year")?.value);
  }

  get cardHolderName() {
    return this.form.get("name")?.value || "Imię i nazwisko";
  }

  get streetName() {
    return this.form.get("streetName");
  }

  get buildingNumber() {
    return this.form.get("buildingNumber");
  }

  get apartmentNumber() {
    return this.form.get("apartmentNumber");
  }

  get zipCode() {
    return this.form.get("zipCode");
  }

  get cityName() {
    return this.form.get("cityName");
  }

  get voivodeship() {
    return this.form.get("voivodeship");
  }

  get phoneNumber() {
    return this.form.get("phoneNumber");
  }

  get preferedLanguage() {
    return this.form.get("preferedLanguage");
  }
}
