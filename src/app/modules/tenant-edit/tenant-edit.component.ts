import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TenantService } from '../tenant-add/tenant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TenantDto } from '../tenant-add/model/tenant-dto';
import { AddressDto } from '../apartment-edit/model/address-dto';
import { LeaseAgreementDto } from '../tenant-add/model/lease-agreement-dto';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';
import { TranslateService } from '@ngx-translate/core';
import { ApartmentDto } from '../apartment-edit/model/apartment-dto';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';
import { ApartmentAddService } from '../apartment-add/apartment-add.service';
import { RentedObjectService } from '../apartment-add/rented-object.service';
import { BaseComponent } from '../common/base.component';

@Component({
  selector: 'app-tenant-edit',
  templateUrl: './tenant-edit.component.html',
  styleUrls: ['./tenant-edit.component.scss']
})
export class TenantEditComponent implements OnInit, OnDestroy, BaseComponent {
  private killer$ = new Subject<void>();
  tenantForm!: FormGroup;
  tenantId!: number;

  daysOfMonth: number[] = [];
  apartments: ApartmentDto[] = [];
  rentedObjects: RentedObjectDto[] = [];
  step = 0;
  retedObjectOfTenant?: number;
  apartmentOfTenant?: number;
  isFormSubmitted: boolean = false;
  isFormValid = () => this.isFormSubmitted || !this.tenantForm?.dirty;

  addressId?: number;
  leaseAgreementId?: number;

  constructor(
    private tenantService: TenantService,
    private acitvatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router,
    private apartmentService: ApartmentAddService,
    private rentedObjectService: RentedObjectService
  ) {
    this.daysOfMonth = [...Array.from({ length: 28 }, (_, index) => index)];
  }

  ngOnInit(): void {
    this.tenantId = Number(this.acitvatedRoute.snapshot.params['id']);
    
    this.tenantService.getTenant(this.tenantId)
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.mapFormValues(data);
      this.leaseAgreementId = data.leaseAgreementDto?.id;
      this.addressId = data.addressDto?.id;
      if (data.apartment?.id != null) {
        this.apartmentOfTenant = data.apartment?.id;
        this.apartmentService.getAllApartments(data.apartment?.id)
          .pipe(takeUntil(this.killer$))
          .subscribe(apartmentsData => this.apartments = apartmentsData);
      }
      if (data.rentedObjectDto?.id != null && data.apartment?.id != null) {
        this.retedObjectOfTenant = data.rentedObjectDto?.id;
        this.rentedObjectService.getAllRentedObjectsByLoggedUser(data.apartment?.id, data.rentedObjectDto?.id)
          .pipe(takeUntil(this.killer$))
          .subscribe(data => this.rentedObjects = data);
      }
    })


    this.tenantForm = new FormGroup({
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
      rentedObjectId: new FormControl('', Validators.required), //wybrana nieruchomość do wynajmu
      apartmentId: new FormControl('', Validators.required),
      contractSigningDate: new FormControl('', Validators.required)
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  getRentedObjects(id: number) {
    this.rentedObjectId?.patchValue(null);
    if(this.apartmentIdControl?.value === this.apartmentOfTenant) {
      this.rentedObjectService.getAllRentedObjectsByLoggedUser(id, this.retedObjectOfTenant)
      .pipe(takeUntil(this.killer$))
      .subscribe(data => this.rentedObjects = data);  
    } else {
      this.rentedObjectService.getAllRentedObjectsByLoggedUser(id)
      .pipe(takeUntil(this.killer$))
      .subscribe(data => this.rentedObjects = data);
    }
  }

  mapFormValues(tenant: TenantDto): void {
    this.tenantForm.patchValue({
      firstname: tenant.firstname,
      lastname: tenant.lastname,
      email: tenant.email,
      accountNumber: tenant.accountNumber,
      phoneNumber: tenant.phoneNumber,
      streetName: tenant.addressDto?.streetName,
      buildingNumber: tenant.addressDto?.buildingNumber,
      apartmentNumber: tenant.addressDto?.apartmentNumber,
      zipCode: tenant.addressDto?.zipCode,
      cityName: tenant.addressDto?.cityName,
      voivodeship: tenant.addressDto?.voivodeship,
      startContractDate: tenant.leaseAgreementDto?.startContractDate,
      endContractDate: tenant.leaseAgreementDto?.endContractDate,
      deposit: tenant.leaseAgreementDto?.deposit,
      depositPaid: tenant.leaseAgreementDto?.depositPaid,
      paymentDueDayOfMonth: tenant.leaseAgreementDto?.paymentDueDayOfMonth,
      rentAmount: tenant.leaseAgreementDto?.rentAmount,
      compensationAmount: tenant.leaseAgreementDto?.compensationAmount,
      internetFee: tenant.leaseAgreementDto?.internetFee,
      gasDeposit: tenant.leaseAgreementDto?.gasDeposit,
      includedWaterMeters: tenant.leaseAgreementDto?.includedWaterMeters,
      initialEnergyMeterReading: tenant.leaseAgreementDto?.initialEnergyMeterReading,
      initialWaterMeterReading: tenant.leaseAgreementDto?.initialWaterMeterReading,
      initialGasMeterReading: tenant.leaseAgreementDto?.initialGasMeterReading,
      depositReturnDate: tenant.leaseAgreementDto?.depositReturnDate,
      returnedDepositAmount: tenant.leaseAgreementDto?.returnedDepositAmount,
      contractActive: tenant.leaseAgreementDto?.contractActive,
      rentedObjectId: tenant.rentedObjectDto?.id,
      apartmentId: tenant.apartment?.id,
      contractSigningDate: tenant.leaseAgreementDto?.contractSigningDate
    });
  }

  submit() {
    if (this.tenantForm.valid) {
      this.isFormSubmitted = true;
      const addressDto: AddressDto = {
        id: this.addressId,
        streetName: this.streetName?.value,
        buildingNumber: this.buildingNumber?.value,
        apartmentNumber: this.apartmentNumber?.value,
        zipCode: this.zipCode?.value,
        cityName: this.cityName?.value,
        voivodeship: this.voivodeship?.value
      }

      const leaseAgreementDto: LeaseAgreementDto = {
        id: this.leaseAgreementId,
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
        contractActive: this.contractActive?.value,
        contractSigningDate: this.contractSigningDate?.value
      }

      const rentedObjectDto: RentedObjectDto = {
        id: this.rentedObjectId?.value
      }

      const apartmentDto: ApartmentDto = {
        id: this.apartmentIdControl?.value
      }

      const tenant: TenantDto = {
        id: this.tenantId,
        firstname: this.firstname?.value,
        lastname: this.lastname?.value,
        email: this.email?.value,
        accountNumber: this.accountNumber?.value,
        phoneNumber: this.phoneNumber?.value,
        leaseAgreementDto: leaseAgreementDto,
        addressDto: addressDto,
        rentedObjectDto: rentedObjectDto,
        apartment: apartmentDto
      }

      this.tenantService.updateTenant(tenant)
      .pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.router.navigate(["agreements/edit", this.tenantId])
          .then(() => {
            const translatedText = this.translateService.instant("snackbar.tenantSaved");
            this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
          })
      });
    } else {
      this.tenantForm.markAllAsTouched();
    }
  }

  setStep(index: number) {
    this.step = index;
    this.tenantForm.reset();
  }

  nextStep() {
    this.step++;
    this.tenantForm.reset();

  }

  prevStep() {
    this.step--;
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

  getApartmentErrorMsg(): string {
    if (this.apartmentIdControl) {
      if (this.apartmentIdControl.hasError('required')) {
        return 'Wartość wymagana';
      }
    }
    return '';
  }

  getRentedObjectErrorMsg(): string {
    if (this.rentedObjectId) {
      if (this.rentedObjectId.hasError('required')) {
        return 'Wartość wymagana';
      }
    }
    return '';
  }

  getContractSigningDateErrorMsg(): string {
    if (this.contractSigningDate) {
      if (this.contractSigningDate.hasError('required')) {
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

  get rentedObjectId() {
    return this.tenantForm.get("rentedObjectId");
  }

  get apartmentIdControl() {
    return this.tenantForm.get("apartmentId");
  }

  get contractSigningDate() {
    return this.tenantForm.get("contractSigningDate");
  }

}
