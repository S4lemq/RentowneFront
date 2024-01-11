import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApartmentEditService } from './apartment-edit.service';
import { ApartmentEditDto } from './model/apartment-edit-dto';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressDto } from './model/address-dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apartment-edit',
  templateUrl: './apartment-edit.component.html',
  styleUrls: ['./apartment-edit.component.scss']
})
export class ApartmentEditComponent implements OnInit{

  apartment!: ApartmentEditDto;
  apartmentForm!: FormGroup;
  rentedObjectsFormArray!: FormArray;

  constructor(
    private router: ActivatedRoute,
    private apartmentEditService: ApartmentEditService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
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
  

  getApartment() {
    let id = Number(this.router.snapshot.params['id']);
    this.apartmentEditService.getApartment(id)
      .subscribe(apartment => {
        this.mapFormValues(apartment)
        this.apartment = apartment;
      });
  }

  submit() {
    if(this.apartmentForm.valid) {
      let id = Number(this.router.snapshot.params['id']);

      const addressDto: AddressDto = {
        id: this.apartment.addressDto.id,
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

      this.apartmentEditService.savePost(id, {
        apartmentName: this.apartmentForm.get('apartmentName')?.value,
        leasesNumber: this.apartmentForm.get('leasesNumber')?.value,
        area: this.apartmentForm.get('area')?.value,
        addressDto: addressDto,
        rentedObjectDtos: rentedObjectsDtosArray
      } as ApartmentEditDto).subscribe(apartment => {
        this.mapFormValues(apartment)
        this.snackBar.open("Mieszkanie zostało zapisane", '', {
          duration: 3000,
          panelClass: ['snackbarSuccess']
        });
      });
    } else {
      this.apartmentForm.markAllAsTouched();
    }
  }

  mapFormValues(apartment: ApartmentEditDto): void {
    this.apartmentForm.patchValue({
      apartmentName: apartment.apartmentName,
      leasesNumber: apartment.leasesNumber,
      area: apartment.area,
      streetName: apartment.addressDto.streetName,
      buildingNumber: apartment.addressDto.buildingNumber,
      apartmentNumber: apartment.addressDto.apartmentNumber,
      zipCode: apartment.addressDto.zipCode,
      cityName: apartment.addressDto.cityName,
      voivodeship: apartment.addressDto.voivodeship,
      rentedObjects: apartment.rentedObjectDtos
    });

  }
  

}
