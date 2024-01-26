import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TenantService } from './tenant.service';
import { TenantDto } from './model/tenant-dto';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { LeaseAgreementDto } from './model/lease-agreement-dto';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';

@Component({
  selector: 'app-tenant-add',
  templateUrl: './tenant-add.component.html',
  styleUrls: ['./tenant-add.component.scss']
})
export class TenantAddComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();
  tenantForm!: FormGroup;
  daysOfMonth: number[] = [];

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
      contractActive: new FormControl(''), //czy aktywna umowa
    });
    this.daysOfMonth = [...Array.from({ length: 28 }, (_, index) => index)];
  }


  submit() {
    console.log('dziala button');
    if (this.tenantForm.valid) {
      console.log('valid')
      const addressDto: AddressDto = {
        streetName: this.streetName?.value,
        buildingNumber: this.buildingNumber?.value,
        apartmentNumber: this.apartmentNumber?.value,
        zipCode: this.zipCode?.value,
        cityName: this.cityName?.value,
        voivodeship: this.voivodeship?.value
      }

      const leaseAgreementDto: LeaseAgreementDto = {
        startContractDate: this.startContractDate?.value,
        endContractDate: this.endContractDate?.value,
        deposit: this.deposit?.value,
        depositPaid: this.depositPaid?.value,
        paymentDueDayOfMonth: this.paymentDueDayOfMonth?.value,
        rentAmount: this.rentAmount?.value,
        compensationAmount: this.compensationAmount?.value,
        internetFee: this.internetFee?.value,
        gasDeposit: this.gasDeposit?.value,
        includedWaterMeters: this.includedWaterMeters?.value,
        initialEnergyMeterReading: this.initialEnergyMeterReading?.value,
        initialWaterMeterReading: this.initialWaterMeterReading?.value,
        initialGasMeterReading: this.initialGasMeterReading?.value,
        depositReturnDate: this.depositReturnDate?.value,
        returnedDepositAmount: this.returnedDepositAmount?.value,
        contractActive: this.contractActive?.value
      }

      this.tenantService.saveTenant(
        {
          firstname: this.firstname?.value,
          lastname: this.lastname?.value,
          email: this.email?.value,
          accountNumber: this.accountNumber?.value,
          phoneNumber: this.phoneNumber?.value,
          addressDto: addressDto,
          leaseAgreementDto: leaseAgreementDto
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
      console.log('nie valid')
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

  getReturnedDepositAmountErrorMsg(): string {
    const returnedDepositAmount = this.returnedDepositAmount;
    if (returnedDepositAmount) {
      if(returnedDepositAmount.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (returnedDepositAmount.hasError('max')) {
        return "Maksymalnie 99999.00zł";
      } else if (returnedDepositAmount.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 2 miejsca po przecinku"
      }
    }
    return '';
  }

  getInitialGasMeterReadingErrorMsg(): string {
    const initialGasMeterReading = this.initialGasMeterReading;
    if (initialGasMeterReading) {
      if(initialGasMeterReading.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (initialGasMeterReading.hasError('max')) {
        return "Maksymalnie 99999.00zł";
      } else if (initialGasMeterReading.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 5 miejsca po przecinku"
      }
    }
    return '';
  }

  getInitialWaterMeterReadingErrorMsg(): string {
    const initialWaterMeterReading = this.initialWaterMeterReading;
    if (initialWaterMeterReading) {
      if (initialWaterMeterReading.hasError('required')) {
        return 'Wartość wymagana';
      } else if(initialWaterMeterReading.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (initialWaterMeterReading.hasError('max')) {
        return "Maksymalnie 99999.00zł";
      } else if (initialWaterMeterReading.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 5 miejsca po przecinku"
      }
    }
    return '';
  }

  getInitialEnergyMeterReadingErrorMsg(): string {
    const initialEnergyMeterReading = this.initialEnergyMeterReading;
    if (initialEnergyMeterReading) {
      if (initialEnergyMeterReading.hasError('required')) {
        return 'Wartość wymagana';
      } else if(initialEnergyMeterReading.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (initialEnergyMeterReading.hasError('max')) {
        return "Maksymalnie 99999.00zł";
      } else if (initialEnergyMeterReading.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 5 miejsca po przecinku"
      }
    }
    return '';
  }

  getIncludedWaterMetersErrorMsg(): string {
    const includedWaterMeters = this.includedWaterMeters;
    if (includedWaterMeters) {
      if (includedWaterMeters.hasError('required')) {
        return 'Wartość wymagana';
      } else if(includedWaterMeters.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (includedWaterMeters.hasError('max')) {
        return "Maksymalnie 99999.00zł";
      } else if (includedWaterMeters.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 3 miejsca po przecinku"
      }
    }
    return '';
  }

  getGasDepositErrorMsg(): string {
    const gasDeposit = this.gasDeposit;
    if (gasDeposit) {
      if(gasDeposit.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (gasDeposit.hasError('max')) {
        return "Maksymalnie 999.00zł";
      } else if (gasDeposit.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 2 miejsca po przecinku"
      }
    }
    return '';
  }

  getInternetFeeErrorMsg(): string {
    const internetFee = this.internetFee;
    if (internetFee) {
      if (internetFee.hasError('required')) {
        return 'Wartość wymagana';
      } else if(internetFee.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (internetFee.hasError('max')) {
        return "Maksymalnie 999.00zł";
      } else if (internetFee.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 2 miejsca po przecinku"
      }
    }
    return '';
  }

  getCompensationAmountErrorMsg(): string {
    const compensationAmount = this.compensationAmount;
    if (compensationAmount) {
      if (compensationAmount.hasError('required')) {
        return 'Wartość wymagana';
      } else if(compensationAmount.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (compensationAmount.hasError('max')) {
        return "Maksymalnie 99999.00zł";
      } else if (compensationAmount.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 2 miejsca po przecinku"
      }
    }
    return '';
  }

  getRentAmountErrorMsg(): string {
    const rentAmount = this.rentAmount;
    if (rentAmount) {
      if (rentAmount.hasError('required')) {
        return 'Wartość wymagana';
      } else if(rentAmount.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (rentAmount.hasError('max')) {
        return "Maksymalnie 99999.00zł";
      } else if (rentAmount.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 2 miejsca po przecinku"
      }
    }
    return '';
  }

  getPaymentDueDateErrorMsg(): string {
    const paymentDueDayOfMonth = this.paymentDueDayOfMonth;
    if (paymentDueDayOfMonth) {
      if (paymentDueDayOfMonth.hasError('required')) {
        return 'Wartość wymagana';
      }
    }
    return '';
  }

  getDepositPaidErrorMsg(): string {
    const depositPaid = this.depositPaid;
    if (depositPaid) {
      if (depositPaid.hasError('required')) {
        return 'Wartość wymagana';
      } else if(depositPaid.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (depositPaid.hasError('max')) {
        return "Maksymalnie 99999.99zł";
      } else if (depositPaid.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 2 miejsca po przecinku"
      }
    }
    return '';
  }

  getDepositErrorMsg(): string {
    const deposit = this.deposit;
    if (deposit) {
      if (deposit.hasError('required')) {
        return 'Wartość wymagana';
      } else if(deposit.hasError('min')) {
        return 'Minimalnie 0zł';
      } else if (deposit.hasError('max')) {
        return "Maksymalnie 99999.99zł";
      } else if (deposit.hasError('maxDecimalPlaces')) {
        return "Maksymalnie 2 miejsca po przecinku"
      }
    }
    return '';
  }

  getStartContractDateErrorMsg(): string {
    const startContractDate = this.startContractDate;
    if (startContractDate) {
      if (startContractDate.hasError('required')) {
        return 'Wartość wymagana';
      }
    }
    return '';
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

  get startContractDate() {
    return this.tenantForm.get("startContractDate");
  }

  get endContractDate() {
    return this.tenantForm.get("endContractDate");
  }

  get deposit() {
    return this.tenantForm.get("deposit");
  }

  get depositPaid() {
    return this.tenantForm.get("depositPaid");
  }

  get paymentDueDayOfMonth() {
    return this.tenantForm.get("paymentDueDayOfMonth");
  }

  get rentAmount() {
    return this.tenantForm.get("rentAmount");
  }

  get compensationAmount() {
    return this.tenantForm.get("compensationAmount");
  }

  get internetFee() {
    return this.tenantForm.get("internetFee");
  }

  get gasDeposit() {
    return this.tenantForm.get("gasDeposit");
  }

  get includedWaterMeters() {
    return this.tenantForm.get("includedWaterMeters");
  }

  get initialEnergyMeterReading() {
    return this.tenantForm.get("initialEnergyMeterReading");
  }

  get initialWaterMeterReading() {
    return this.tenantForm.get("initialWaterMeterReading");
  }

  get initialGasMeterReading() {
    return this.tenantForm.get("initialGasMeterReading");
  }

  get depositReturnDate() {
    return this.tenantForm.get("depositReturnDate");
  }

  get returnedDepositAmount() {
    return this.tenantForm.get("returnedDepositAmount");
  }

  get contractActive() {
    return this.tenantForm.get("contractActive");
  }

}
