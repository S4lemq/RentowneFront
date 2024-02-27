import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BaseComponent } from '../common/base.component';
import { ImageService } from '../common/service/image.service';
import { NavigationService } from '../common/service/navigation.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { ImageCropperComponent } from '../profile-edit/image-cropper/image-cropper.component';
import { ImageDataDto } from '../profile-edit/model/image-data';
import { ApartmentEditService } from './apartment-edit.service';
import { AddressDto } from './model/address-dto';
import { ApartmentDto } from './model/apartment-dto';
import { ApartmentImageCropperComponent } from '../apartment-image-cropper/apartment-image-cropper.component';

@Component({
  selector: 'app-apartment-edit',
  templateUrl: './apartment-edit.component.html',
  styleUrls: ['./apartment-edit.component.scss']
})
export class ApartmentEditComponent implements OnInit, OnDestroy, BaseComponent {
  private killer$ = new Subject<void>();

  apartment!: ApartmentDto;
  apartmentForm!: FormGroup;
  rentedObjectsFormArray!: FormArray;
  requredFileTypes = "image/jpeg, image/png";
  image?: string | null = null;
  apartmentId!: number;
  selectedIndex!: number;
  isFormSubmitted: boolean = false;
  imageSelected: boolean = false;
  file: string = '';

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private apartmentEditService: ApartmentEditService,
    private snackBar: MatSnackBar,
    private dialogService: ConfirmDialogService,
    private router: Router,
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private imageService: ImageService,
    private dialog: MatDialog
  ) { }

  isFormValid(): boolean {
    return (this.isFormSubmitted || !this.apartmentForm?.dirty) && !this.imageSelected;
  }

  ngOnInit(): void {
    this.apartmentId = Number(this.acitvatedRoute.snapshot.params['id']);
    this.getApartment();
    
    this.apartmentForm = new FormGroup({
      apartmentName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
      leasesNumber: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
      area: new FormControl('', [Validators.required, Validators.min(1), Validators.max(999.99)]),
      streetName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
      buildingNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      apartmentNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      cityName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
      voivodeship: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
      rentedObjects: new FormArray([]),
      file: new FormControl('')
    });
    this.apartmentForm.get('leasesNumber')?.valueChanges
    .pipe(takeUntil(this.killer$))
    .subscribe((leasesNumber: number) => {
      this.updateRentedObjects(leasesNumber);
    });

    const lastTabLabel = this.navigationService.getLastTabLabel();
    if (lastTabLabel) {
      this.selectedIndex = this.convertLabelToIndex(lastTabLabel);
      this.navigationService.setLastTabLabel('');
    }
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  goBack() {
    this.navigationService.goBack();
  }

  convertLabelToIndex(label: string): number {
    switch(label) {
      case 'apartments': return 0;
      case 'housing-provider': return 1;
      case 'meters': return 2;
      default: return 0;
    }
  }

  getApartment() {
    this.apartmentEditService.getApartment(this.apartmentId)
      .pipe(takeUntil(this.killer$))
      .subscribe(apartment => {
        this.mapFormValues(apartment)
        this.apartment = apartment;
        if (apartment.image) {
          this.image = apartment.image; // Przechowuje nazwę pliku obrazu
          this.file = '/api/data/image/' + apartment.image; // Ustawia URL do wyświetlenia obrazu
        }
      });
  }

  submit() {
    if (this.apartmentForm.valid) {
      this.isFormSubmitted = true;
      const addressDto: AddressDto = {
        id: this.apartment.addressDto?.id,
        streetName: this.apartmentForm.get('streetName')?.value,
        buildingNumber: this.apartmentForm.get('buildingNumber')?.value,
        apartmentNumber: this.apartmentForm.get('apartmentNumber')?.value,
        zipCode: this.apartmentForm.get('zipCode')?.value,
        cityName: this.apartmentForm.get('cityName')?.value,
        voivodeship: this.apartmentForm.get('voivodeship')?.value,
      }
      const rentedObjectsDtosArray = Array.from(this.getRentedObjectsFormArray.controls, control => ({
        rentedObjectName: control.get('rentedObjectName')?.value
      }));
      if (this.imageSelected) {
        this.imageSelected = false;
        let formData = new FormData();
        formData.append('file', this.fileControl?.value);
        this.imageService.uploadImage(formData)
          .pipe(takeUntil(this.killer$))
          .subscribe(result => {
            this.image = result.filename;
            this.apartmentEditService.savePost(this.apartmentId, {
              apartmentName: this.apartmentName?.value,
              leasesNumber: this.leasesNumber?.value,
              area: this.area?.value,
              addressDto: addressDto,
              rentedObjectDtos: rentedObjectsDtosArray,
              image: result.filename
            } as ApartmentDto)
            .pipe(takeUntil(this.killer$))
            .subscribe(() => {
              this.router.navigate(["/apartments/edit", this.apartmentId])
              .then(() => {
                const translatedText = this.translateService.instant("snackbar.apartmentSaved");
                this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
              })
            });
          });
      } else {
        this.apartmentEditService.savePost(this.apartmentId, {
          apartmentName: this.apartmentName?.value,
          leasesNumber: this.leasesNumber?.value,
          area: this.area?.value,
          addressDto: addressDto,
          rentedObjectDtos: rentedObjectsDtosArray,
          image: this.image
        } as ApartmentDto)
        .pipe(takeUntil(this.killer$))
        .subscribe(() => {
          this.router.navigate(["/apartments/edit", this.apartmentId])
          .then(() => {
            const translatedText = this.translateService.instant("snackbar.apartmentSaved");
            this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
          })
        });
      }
    } else {
      this.apartmentForm.markAllAsTouched();
    }
  }

  mapFormValues(apartment: ApartmentDto): void {
    this.apartmentForm.patchValue({
      apartmentName: apartment.apartmentName,
      leasesNumber: apartment.leasesNumber,
      area: apartment.area,
      streetName: apartment.addressDto?.streetName,
      buildingNumber: apartment.addressDto?.buildingNumber,
      apartmentNumber: apartment.addressDto?.apartmentNumber,
      zipCode: apartment.addressDto?.zipCode,
      cityName: apartment.addressDto?.cityName,
      voivodeship: apartment.addressDto?.voivodeship,
      rentedObjects: apartment.rentedObjectDtos
    });
    this.image = apartment.image;
  }

  confirmDelete(id: number | undefined) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz usunąć mieszkanie?")
      .afterClosed()
        .pipe(takeUntil(this.killer$))
        .subscribe(result => {
          if(result) {
            this.apartmentEditService.delete(id)
              .pipe(takeUntil(this.killer$))
              .subscribe(() => {
                this.router.navigate(["/apartments"])
              });
          }
        });
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    if (files.length > 0) {
      const originalFile = files[0];
      const _file = URL.createObjectURL(originalFile)
      this.resetInput();
      this.openAvatarEditor({image: _file, fileName: originalFile.name} as ImageDataDto)
        .pipe(takeUntil(this.killer$))
        .subscribe(
          (result) => {
            if (result) {
                // result to teraz File, więc tworzymy z niego URL obiektu
                const objectUrl = URL.createObjectURL(result);
                this.file = objectUrl; // Używamy URL obiektu zamiast bezpośredniego pliku
                this.imageSelected = true;
                this.apartmentForm.patchValue({
                  file: result
                });
            }
          }
        )
    }
  }

  openAvatarEditor(imageData: ImageDataDto): Observable<any> {
    const dialogRef = this.dialog.open(ApartmentImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: imageData,
    });

    return dialogRef.afterClosed();
  }

  resetInput(){
    const input = document.getElementById('avatar-input-file') as HTMLInputElement; //do poprawy bo nazwa pliku powinna byc przekazywana
    if(input){
      input.value = "";
    }
  }


  private updateRentedObjects(leasesNumber: number): void {
    this.rentedObjectsFormArray = this.apartmentForm.get('rentedObjects') as FormArray;
    const currentNumber = this.rentedObjectsFormArray.length;

    if (leasesNumber > currentNumber) {
      for (let i = currentNumber; i < leasesNumber; i++) {
        this.rentedObjectsFormArray.push(new FormGroup({
          rentedObjectName: new FormControl('', Validators.required)
        }));
      }
    } else if (leasesNumber < currentNumber) {
      for (let i = currentNumber; i > leasesNumber; i--) {
        this.rentedObjectsFormArray.removeAt(i - 1);
      }
    }
  }
  
  getApartmentNameErrorMsg() {
    if(this.apartmentName?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.apartmentName?.errors?.['minlength']) {
      return 'Minimum 4 znaki';
    }
    if (this.apartmentName?.errors?.['maxlength']) {
      return "Maksymalnie 60 znaków";
    }
    return null;
  }


  getleasesNumberErrorMsg() {
    if(this.leasesNumber?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.leasesNumber?.errors?.['min']) {
      return 'Minimalnie 1';
    }
    if (this.leasesNumber?.errors?.['max']) {
      return "Maksymalnie 90";
    }
    return null;
  }

  getAreaNumberErrorMsg() {
    if(this.area?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.area?.errors?.['min']) {
      return 'Minimalnie 1';
    }
    if (this.area?.errors?.['max']) {
      return "Maksymalnie 999.99";
    }
    return null;
  }

  getStreetNameErrorMsg() {
    if(this.streetName?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.streetName?.errors?.['minlength']) {
      return 'Minimalnie 4';
    }
    if (this.streetName?.errors?.['maxlength']) {
      return "Maksymalnie 100";
    }
    return null;
  }

  getBuildingNumberErrorMsg() {
    if(this.buildingNumber?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.buildingNumber?.errors?.['minlength']) {
      return 'Minimalnie 1';
    }
    if (this.buildingNumber?.errors?.['maxlength']) {
      return "Maksymalnie 10";
    }
    return null;
  }

  getApartmentNumberErrorMsg() {
    if(this.buildingNumber?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.buildingNumber?.errors?.['minlength']) {
      return 'Minimalnie 1';
    }
    if (this.buildingNumber?.errors?.['maxlength']) {
      return "Maksymalnie 10";
    }
    return null;
  }

  getZipCodeErrorMsg() {
    if(this.zipCode?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.zipCode?.errors?.['minlength']) {
      return 'Minimalnie 1';
    }
    if (this.zipCode?.errors?.['maxlength']) {
      return "Maksymalnie 10";
    }
    return null;
  }

  getCityNameErrorMsg() {
    if(this.cityName?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.cityName?.errors?.['minlength']) {
      return 'Minimalnie 4';
    }
    if (this.cityName?.errors?.['maxlength']) {
      return "Maksymalnie 60";
    }
    return null;
  }

  getVoivodeshipErrorMsg() {
    if(this.voivodeship?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.voivodeship?.errors?.['minlength']) {
      return 'Minimalnie 4';
    }
    if (this.voivodeship?.errors?.['maxlength']) {
      return "Maksymalnie 60";
    }
    return null;
  }

  get getRentedObjectsFormArray(): FormArray {
    return this.apartmentForm.get('rentedObjects') as FormArray;
  }

  get apartmentName() {
    return this.apartmentForm.get("apartmentName");
  }

  get leasesNumber() {
    return this.apartmentForm.get("leasesNumber");
  }

  get area() {
    return this.apartmentForm.get("area");
  }

  get streetName() {
    return this.apartmentForm.get("streetName");
  }

  get buildingNumber() {
    return this.apartmentForm.get("buildingNumber");
  }

  get apartmentNumber() {
    return this.apartmentForm.get("apartmentNumber");
  }

  get zipCode() {
    return this.apartmentForm.get("zipCode");
  }

  get cityName() {
    return this.apartmentForm.get("cityName");
  }

  get voivodeship() {
    return this.apartmentForm.get("voivodeship");
  }

  get fileControl() {
    return this.apartmentForm.get("file");
  }


}
