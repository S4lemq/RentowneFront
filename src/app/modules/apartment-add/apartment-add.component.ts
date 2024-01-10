import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApartmentAddService } from './apartment-add.service';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { ApartmentEditDto } from '../apartment-edit/model/apartment-edit-dto';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-apartment-add',
  templateUrl: './apartment-add.component.html',
  styleUrls: ['./apartment-add.component.scss']
})
export class ApartmentAddComponent implements OnInit{

  apartmentForm!: FormGroup;

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
    })
  }

  submit() {
    if( this.apartmentForm.valid ) {
      const addressDto: AddressDto = {
        streetName: this.apartmentForm.get('streetName')?.value,
        buildingNumber: this.apartmentForm.get('buildingNumber')?.value,
        apartmentNumber: this.apartmentForm.get('apartmentNumber')?.value,
        zipCode: this.apartmentForm.get('zipCode')?.value,
        cityName: this.apartmentForm.get('cityName')?.value,
        voivodeship: this.apartmentForm.get('voivodeship')?.value,
      }
  
      this.apartmentAddService.saveNewApartment({
        apartmentName: this.apartmentForm.get('apartmentName')?.value,
        leasesNumber: this.apartmentForm.get('leasesNumber')?.value,
        area: this.apartmentForm.get('area')?.value,
        addressDto: addressDto
      } as ApartmentEditDto).subscribe(apartment => {
        const translatedText = this.translateService.instant("snackbar.apartmentAdded");
        this.router.navigate(["/apartments/edit", apartment.id])
            .then(() => this.snackBar.open(translatedText, '', {
                duration: 3000,
                panelClass: ['snackbar']
            }));
      });
    } else {
      this.apartmentForm.markAllAsTouched();
    }
  }

}
