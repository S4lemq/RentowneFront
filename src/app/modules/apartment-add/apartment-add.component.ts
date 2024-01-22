import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { ApartmentDto } from '../apartment-edit/model/apartment-dto';
import { ApartmentAddService } from './apartment-add.service';

@Component({
  selector: 'app-apartment-add',
  templateUrl: './apartment-add.component.html',
  styleUrls: ['./apartment-add.component.scss']
})
export class ApartmentAddComponent implements OnInit{

  apartmentForm!: FormGroup;
  rentedObjectsFormArray!: FormArray;
  
  constructor(
    private apartmentAddService: ApartmentAddService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
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
      rentedObjects: new FormArray([])
    });
    this.apartmentForm.get('leasesNumber')?.valueChanges.subscribe((leasesNumber: number) => {
      this.updateRentedObjects(leasesNumber);
    });
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

  get getRentedObjectsFormArray(): FormArray {
    return this.apartmentForm.get('rentedObjects') as FormArray;
  }
  
  

  submit() {
    if( this.apartmentForm.valid ) {
      const addressDto: AddressDto = {
        id: null,
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
  
      this.apartmentAddService.saveNewApartment({
        apartmentName: this.apartmentForm.get('apartmentName')?.value,
        leasesNumber: this.apartmentForm.get('leasesNumber')?.value,
        area: this.apartmentForm.get('area')?.value,
        addressDto: addressDto,
        rentedObjectDtos: rentedObjectsDtosArray
      } as ApartmentDto).subscribe(apartment => {
        const translatedText = this.translateService.instant("snackbar.apartmentAdded");
        this.router.navigate(["/apartments/edit", apartment.id])
            .then(() => this.snackBar.open(translatedText, '', {
                duration: 3000,
                panelClass: ['snackbarSuccess']
            }));
      });
    } else {
      this.apartmentForm.markAllAsTouched();
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

}
