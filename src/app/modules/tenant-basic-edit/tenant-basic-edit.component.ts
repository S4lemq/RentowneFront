import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { BaseComponent } from '../common/base.component';
import { TenantDto } from '../tenant-add/model/tenant-dto';
import { TenantService } from '../tenant-add/tenant.service';
import { LeaseAgreementDto } from '../tenant-add/model/lease-agreement-dto';

@Component({
  selector: 'app-tenant-basic-edit',
  templateUrl: './tenant-basic-edit.component.html',
  styleUrls: ['./tenant-basic-edit.component.scss']
})
export class TenantBasicEditComponent implements OnInit, OnDestroy, BaseComponent {
  private killer$ = new Subject<void>();
  form!: FormGroup;
  isFormSubmitted: boolean = false;
  tenantId!: number;
  tenantDto!: TenantDto;

  constructor(
    private tenantService: TenantService,
    private acitvatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  isFormValid = () => this.isFormSubmitted || !this.form?.dirty;
 
  ngOnInit(): void {
    this.tenantId = Number(this.acitvatedRoute.snapshot.params['id']);

    this.tenantService.getTenant(this.tenantId)
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.mapFormValues(data);
      this.tenantDto = data;
    });

    this.form = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email: new FormControl({value: '', disabled: true}),
      accountNumber: new FormControl('', [Validators.maxLength(28)]),
      phoneNumber: new FormControl('', [Validators.maxLength(20)]),
      streetName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
      buildingNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      apartmentNumber: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      cityName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
      voivodeship: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
      startContractDate: new FormControl({value: '', disabled: true}),
      endContractDate: new FormControl({value: '', disabled: true}),
      apartment: new FormControl({value: '', disabled: true}),
      rentedObject: new FormControl({value: '', disabled: true}),
    });

  }

  mapFormValues(dto: TenantDto): void {
    this.form.patchValue({
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      accountNumber: dto.accountNumber,
      phoneNumber: dto.phoneNumber,
      streetName: dto.addressDto?.streetName,
      buildingNumber: dto.addressDto?.buildingNumber,
      apartmentNumber: dto.addressDto?.apartmentNumber,
      zipCode: dto.addressDto?.zipCode,
      cityName: dto.addressDto?.cityName,
      voivodeship: dto.addressDto?.voivodeship,
      startContractDate: dto.leaseAgreementDto?.startContractDate,
      endContractDate: dto.leaseAgreementDto?.endContractDate,
      apartment: dto.apartment?.apartmentName,
      rentedObject: dto.rentedObjectDto?.rentedObjectName
    });
  }

  submit() {
    if (this.form.valid) {
      this.isFormSubmitted = true;
      const addressDto: AddressDto = {
        id: this.tenantDto.addressDto?.id,
        streetName: this.streetName?.value,
        buildingNumber: this.buildingNumber?.value,
        apartmentNumber: this.apartmentNumber?.value,
        zipCode: this.zipCode?.value,
        cityName: this.cityName?.value,
        voivodeship: this.voivodeship?.value
      }

      const tenant: TenantDto = {
        id: this.tenantDto.id,
        firstname: this.firstname?.value,
        lastname: this.lastname?.value,
        email: this.email?.value,
        accountNumber: this.accountNumber?.value,
        phoneNumber: this.phoneNumber?.value,
        addressDto: addressDto,
        leaseAgreementDto: this.tenantDto.leaseAgreementDto,
        rentedObjectDto: this.tenantDto.rentedObjectDto,
        apartment: this.tenantDto.apartment
      }

      this.tenantService.updateTenant(tenant)
      .pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.router.navigate(["tenants/edit", this.tenantId])
          .then(() => {
            const translatedText = this.translateService.instant("snackbar.tenantSaved");
            this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
          })
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  getFirstnameErrorMsg() {
    if(this.firstname?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.firstname?.errors?.['minlength']) {
      return 'Minimalnie 3';
    }
    if (this.firstname?.errors?.['maxlength']) {
      return "Maksymalnie 50";
    }
    return null;
  }

  getLastnameErrorMsg() {
    if(this.lastname?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.lastname?.errors?.['minlength']) {
      return 'Minimalnie 3';
    }
    if (this.lastname?.errors?.['maxlength']) {
      return "Maksymalnie 50";
    }
    return null;
  }

  getEmailErrorMsg() {
    if (this.email?.errors?.['email']) {
      return 'Nieprawidłowy format e-mail';
    }
    if (this.email?.errors?.['required']) {
      return 'Wartość wymagana';
    }
    if (this.email?.errors?.['maxlength']) {
      return "Maksymalnie 60";
    }
    return null;
  }

  getAccountNumberErrorMsg() {
    if (this.accountNumber?.errors?.['maxlength']) {
      return 'Maksymalnie 28';
    }
    return null;
  }

  getPhoneNumberErrorMsg() {
    if (this.phoneNumber?.errors?.['maxlength']) {
      return 'Maksymalnie 20';
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

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
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

  get accountNumber() {
    return this.form.get("accountNumber");
  }

  get phoneNumber() {
    return this.form.get("phoneNumber");
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

}
