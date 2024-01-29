import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';
import { LeaseAgreementDto } from './model/lease-agreement-dto';
import { TenantDto } from './model/tenant-dto';
import { TenantService } from './tenant.service';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';

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
    private tenantService: TenantService,
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

      startContractDate: new FormControl('', Validators.required), //od kiedy najem
      endContractDate: new FormControl('', Validators.required), //do kiedy najem
      deposit: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(2)]), //kaucja
      depositPaid: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(2)]), //wpłacona kaucja
      paymentDueDayOfMonth: new FormControl('', Validators.required), //termin płatności
      rentAmount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(2)]), //kwota czynszu
      compensationAmount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(2)]), //kwota odstępnego
      internetFee: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999), maxDecimalPlaces(2)]), //kwota za internet
      gasDeposit: new FormControl('', [Validators.min(0), Validators.max(999), maxDecimalPlaces(2)]), //opłata za gaz
      includedWaterMeters: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(3)]), //ilość m^3 wliczonej wody
      initialEnergyMeterReading: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]), //początkowy odczyt energii
      initialWaterMeterReading: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]), //początkowy odczyt wody
      initialGasMeterReading: new FormControl('', [Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]), //początkowy odczyt gazu
      depositReturnDate: new FormControl(''), //data zwrotu kaucji
      returnedDepositAmount: new FormControl('',[Validators.min(0), Validators.max(99999.99), maxDecimalPlaces(2)]), //kwota zwróconej kaucji
      contractActive: new FormControl(''), //czy aktywna umowa,
      rentedObjectId: new FormControl(''), //wybrana nieruchomość do wynajmu
    });
  }


  submit() {
    if (this.tenantForm.valid) {
      const addressDto: AddressDto = {
        streetName: this.tenantForm.get('streetName')?.value,
        buildingNumber: this.tenantForm.get('buildingNumber')?.value,
        apartmentNumber: this.tenantForm.get('apartmentNumber')?.value,
        zipCode: this.tenantForm.get('zipCode')?.value,
        cityName: this.tenantForm.get('cityName')?.value,
        voivodeship: this.tenantForm.get('voivodeship')?.value
      }

      const leaseAgreementDto: LeaseAgreementDto = {
        startContractDate: this.tenantForm.get('startContractDate')?.value,
        endContractDate: this.tenantForm.get('endContractDate')?.value,
        deposit: this.tenantForm.get('deposit')?.value,
        depositPaid: this.tenantForm.get('depositPaid')?.value,
        paymentDueDayOfMonth: this.tenantForm.get('paymentDueDayOfMonth')?.value,
        rentAmount: this.tenantForm.get('rentAmount')?.value,
        compensationAmount: this.tenantForm.get('compensationAmount')?.value,
        internetFee: this.tenantForm.get('internetFee')?.value,
        gasDeposit: this.tenantForm.get('gasDeposit')?.value,
        includedWaterMeters: this.tenantForm.get('includedWaterMeters')?.value,
        initialEnergyMeterReading: this.tenantForm.get('initialEnergyMeterReading')?.value,
        initialWaterMeterReading: this.tenantForm.get('initialWaterMeterReading')?.value,
        initialGasMeterReading: this.tenantForm.get('initialGasMeterReading')?.value,
        depositReturnDate: this.tenantForm.get('depositReturnDate')?.value,
        returnedDepositAmount: this.tenantForm.get('returnedDepositAmount')?.value,
        contractActive: this.tenantForm.get('contractActive')?.value
      }

      const rentedObjectDto: RentedObjectDto = {
        id: this.tenantForm.get('rentedObjectId')?.value
      }

      this.tenantService.saveTenant(
        {
          firstname: this.tenantForm.get('firstname')?.value,
          lastname: this.tenantForm.get('lastname')?.value,
          email: this.tenantForm.get('email')?.value,
          accountNumber: this.tenantForm.get('accountNumber')?.value,
          phoneNumber: this.tenantForm.get('phoneNumber')?.value,
          addressDto: addressDto,
          leaseAgreementDto: leaseAgreementDto,
          rentedObjectDto: rentedObjectDto
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

}
