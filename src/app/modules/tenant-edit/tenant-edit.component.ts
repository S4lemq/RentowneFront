import { Component } from '@angular/core';
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

@Component({
  selector: 'app-tenant-edit',
  templateUrl: './tenant-edit.component.html',
  styleUrls: ['./tenant-edit.component.scss']
})
export class TenantEditComponent {
  private killer$ = new Subject<void>();
  tenantForm!: FormGroup;
  tenantId!: number;

  addressId?: number;
  leaseAgreementId?: number;

  constructor(
    private tenantService: TenantService,
    private acitvatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tenantId = Number(this.acitvatedRoute.snapshot.params['id']);
    this.getTenant();
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
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  getTenant() {
    this.tenantService.getTenant(this.tenantId)
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.mapFormValues(data);
      this.leaseAgreementId = data.leaseAgreementDto?.id;
      this.addressId = data.addressDto?.id;
    })
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
      contractActive: tenant.leaseAgreementDto?.contractActive
    });
  }

  submit() {
    if (this.tenantForm.valid) {
      const addressDto: AddressDto = {
        id: this.addressId,
        streetName: this.tenantForm.get('streetName')?.value,
        buildingNumber: this.tenantForm.get('buildingNumber')?.value,
        apartmentNumber: this.tenantForm.get('apartmentNumber')?.value,
        zipCode: this.tenantForm.get('zipCode')?.value,
        cityName: this.tenantForm.get('cityName')?.value,
        voivodeship: this.tenantForm.get('voivodeship')?.value
      }

      const leaseAgreementDto: LeaseAgreementDto = {
        id: this.leaseAgreementId,
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

      const tenant: TenantDto = {
        id: this.tenantId,
        firstname: this.tenantForm.get('firstname')?.value,
        lastname: this.tenantForm.get('lastname')?.value,
        email: this.tenantForm.get('email')?.value,
        accountNumber: this.tenantForm.get('accountNumber')?.value,
        phoneNumber: this.tenantForm.get('phoneNumber')?.value,
        leaseAgreementDto: leaseAgreementDto,
        addressDto: addressDto
      }

      this.tenantService.updateTenant(tenant)
      .pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.router.navigate(["/tenants/edit", this.tenantId])
          .then(() => {
            const translatedText = this.translateService.instant("snackbar.tenantSaved");
            this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
          })
      });
    } else {
      this.tenantForm.markAllAsTouched();
    }
  }


}
