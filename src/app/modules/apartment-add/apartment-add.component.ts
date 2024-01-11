import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApartmentAddService } from './apartment-add.service';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { ApartmentDto } from '../apartment-edit/model/apartment-dto';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';

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

}
