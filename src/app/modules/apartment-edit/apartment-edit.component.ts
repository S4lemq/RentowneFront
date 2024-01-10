import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApartmentEditService } from './apartment-edit.service';
import { ApartmentEditDto } from './model/apartment-edit-dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    })
  }

  getApartment() {
    let id = Number(this.router.snapshot.params['id']);
    this.apartmentEditService.getApartment(id)
      .subscribe(apartment => this.mapFormValues(apartment));
  }

  submit() {
    if(this.apartmentForm.valid) {
      let id = Number(this.router.snapshot.params['id']);

      const addressDto: AddressDto = {
        streetName: this.apartmentForm.get('streetName')?.value,
        buildingNumber: this.apartmentForm.get('buildingNumber')?.value,
        apartmentNumber: this.apartmentForm.get('apartmentNumber')?.value,
        zipCode: this.apartmentForm.get('zipCode')?.value,
        cityName: this.apartmentForm.get('cityName')?.value,
        voivodeship: this.apartmentForm.get('voivodeship')?.value,
      }

      this.apartmentEditService.savePost(id, {
        apartmentName: this.apartmentForm.get('apartmentName')?.value,
        leasesNumber: this.apartmentForm.get('leasesNumber')?.value,
        area: this.apartmentForm.get('area')?.value,
        addressDto: addressDto
      } as ApartmentEditDto).subscribe(apartment => {
        this.mapFormValues(apartment)
        this.snackBar.open("Mieszkanie zostało zapisane", '', {
          duration: 3000,
          panelClass: ['snackbar']
        });
      });
    } else {
      this.apartmentForm.markAllAsTouched();
    }
  }

  mapFormValues(apartment: ApartmentEditDto): void {
    return this.apartmentForm.setValue({
      apartmentName: apartment.apartmentName,
      leasesNumber: apartment.leasesNumber,
      area: apartment.area,
      streetName: apartment.addressDto.streetName,
      buildingNumber: apartment.addressDto.buildingNumber,
      apartmentNumber: apartment.addressDto.apartmentNumber,
      zipCode: apartment.addressDto.zipCode,
      cityName: apartment.addressDto.cityName,
      voivodeship: apartment.addressDto.voivodeship,
    })
  }

}
