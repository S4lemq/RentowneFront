import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TenantService } from './tenant.service';
import { TenantDto } from './model/tenant-dto';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { LeaseAgreementDto } from '../lease-agreement-add/model/lease-agreement-dto';

@Component({
  selector: 'app-tenant-add',
  templateUrl: './tenant-add.component.html',
  styleUrls: ['./tenant-add.component.scss']
})
export class TenantAddComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();
  tenantForm!: FormGroup;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private snackBar: MatSnackBar,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.tenantForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(60)]),
      accountNumber: new FormControl('', [Validators.maxLength(28)]),
      phoneNumber: new FormControl('', [Validators.maxLength(20)]),
      streetName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
      buildingNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      apartmentNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      cityName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
      voivodeship: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
    });
  }


  submit() {
    if (this.tenantForm.valid) {
      const addressDto: AddressDto = {
        streetName: this.streetName?.value,
        buildingNumber: this.buildingNumber?.value,
        apartmentNumber: this.apartmentNumber?.value,
        zipCode: this.zipCode?.value,
        cityName: this.cityName?.value,
        voivodeship: this.voivodeship?.value
      }

      const leaseAgreementDto: LeaseAgreementDto = {
        id: 13
      }

      this.tenantService.saveTenant(
        {
          firstname: this.firstname?.value,
          lastname: this.lastname?.value,
          email: this.email?.value,
          accountNumber: this.accountNumber?.value,
          phoneNumber: this.phoneNumber?.value,
          leaseAgreementDto: leaseAgreementDto,
          addressDto: addressDto
        } as TenantDto
      ).pipe(takeUntil(this.killer$))
      .subscribe(tenant => {
        const translatedText = this.translateService.instant("snackbar.tenantAdded");
        this.router.navigate(["tenants/edit/", tenant.id])
            .then(() => this.snackBar.open(translatedText, '', {
                duration: 3000,
                panelClass: ['snackbarSuccess']
            }));
      });
    } else {
      this.tenantForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
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


  get firstname() {
    return this.tenantForm.get("firstname");
  }

  get lastname() {
    return this.tenantForm.get("lastname");
  }

  get email() {
    return this.tenantForm.get("email");
  }

  get accountNumber() {
    return this.tenantForm.get("accountNumber");
  }

  get phoneNumber() {
    return this.tenantForm.get("phoneNumber");
  }

  get streetName() {
    return this.tenantForm.get("streetName");
  }

  get buildingNumber() {
    return this.tenantForm.get("buildingNumber");
  }

  get apartmentNumber() {
    return this.tenantForm.get("apartmentNumber");
  }

  get zipCode() {
    return this.tenantForm.get("zipCode");
  }

  get cityName() {
    return this.tenantForm.get("cityName");
  }

  get voivodeship() {
    return this.tenantForm.get("voivodeship");
  }


}
