import { Component, OnDestroy, OnInit } from '@angular/core';
import { LeaseAgreementService } from '../lease-agreement-add/lease-agreement.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, concatAll, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeaseAgreementDto } from '../lease-agreement-add/model/lease-agreement-dto';

@Component({
  selector: 'app-lease-agreement-edit',
  templateUrl: './lease-agreement-edit.component.html',
  styleUrls: ['./lease-agreement-edit.component.scss']
})
export class LeaseAgreementEditComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();
  leaseAgreementForm!: FormGroup;
  leaseAgreementId!: number;

  constructor(
    private leaseAgreementService: LeaseAgreementService,
    private acitvatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.leaseAgreementId = Number(this.acitvatedRoute.snapshot.params['id']);
    this.getLeaseAgreement();

    this.leaseAgreementForm = new FormGroup({
      startContractDate: new FormControl('', Validators.required), //od kiedy najem
      endContractDate: new FormControl('', Validators.required), //do kiedy najem
      deposit: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(2)]), //kaucja
      depositPaid: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(2)]), //wpłacona kaucja
      paymentDueDate: new FormControl('', Validators.required), //termin płatności
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
      isContractActive: new FormControl('', Validators.required), //czy aktywna umowa
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  getLeaseAgreement() {
    this.leaseAgreementService.getLeaseAgreementDto(this.leaseAgreementId)
    .pipe(takeUntil(this.killer$))
    .subscribe(leaseAgreement => {
      this.mapFormValues(leaseAgreement);
      console.log(this.leaseAgreementForm);
    })
  }

  mapFormValues(leaseAgreement: LeaseAgreementDto): void {
    this.leaseAgreementForm.patchValue({
      startContractDate: leaseAgreement.startContractDate,
      endContractDate: leaseAgreement.endContractDate,
      deposit: leaseAgreement.deposit,
      depositPaid: leaseAgreement.depositPaid,
      paymentDueDate: leaseAgreement.paymentDueDate,
      rentAmount: leaseAgreement.rentAmount,
      compensationAmount: leaseAgreement.compensationAmount,
      internetFee: leaseAgreement.internetFee,
      gasDeposit: leaseAgreement.gasDeposit,
      includedWaterMeters: leaseAgreement.includedWaterMeters,
      initialEnergyMeterReading: leaseAgreement.initialEnergyMeterReading,
      initialWaterMeterReading: leaseAgreement.initialWaterMeterReading,
      initialGasMeterReading: leaseAgreement.initialGasMeterReading,
      depositReturnDate: leaseAgreement.depositReturnDate,
      returnedDepositAmount: leaseAgreement.returnedDepositAmount,
      isContractActive: leaseAgreement.contractActive
    });
  }

  submit() {
    if (this.leaseAgreementForm.valid) {
      this.leaseAgreementService.saveLeaseAgreement(
        {
          id: this.leaseAgreementId,
          startContractDate: this.startContractDate?.value,
          endContractDate: this.endContractDate?.value,
          deposit: this.deposit?.value,
          depositPaid: this.depositPaid?.value,
          paymentDueDate: this.paymentDueDate?.value,
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
          isContractActive: this.isContractActive?.value
        } as LeaseAgreementDto
      ).pipe(takeUntil(this.killer$))
      .subscribe(meter => {
        this.snackBar.open("Umowa została zapisana", '', {
          duration: 3000,
          panelClass: ['snackbarSuccess']
        });
      });
    } else {
      this.leaseAgreementForm.markAllAsTouched();
    }
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
    const paymentDueDate = this.paymentDueDate;
    if (paymentDueDate) {
      if (paymentDueDate.hasError('required')) {
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

  get startContractDate() {
    return this.leaseAgreementForm.get("startContractDate");
  }

  get endContractDate() {
    return this.leaseAgreementForm.get("endContractDate");
  }

  get deposit() {
    return this.leaseAgreementForm.get("deposit");
  }

  get depositPaid() {
    return this.leaseAgreementForm.get("depositPaid");
  }

  get paymentDueDate() {
    return this.leaseAgreementForm.get("paymentDueDate");
  }

  get rentAmount() {
    return this.leaseAgreementForm.get("rentAmount");
  }

  get compensationAmount() {
    return this.leaseAgreementForm.get("compensationAmount");
  }

  get internetFee() {
    return this.leaseAgreementForm.get("internetFee");
  }

  get gasDeposit() {
    return this.leaseAgreementForm.get("gasDeposit");
  }

  get includedWaterMeters() {
    return this.leaseAgreementForm.get("includedWaterMeters");
  }

  get initialEnergyMeterReading() {
    return this.leaseAgreementForm.get("initialEnergyMeterReading");
  }

  get initialWaterMeterReading() {
    return this.leaseAgreementForm.get("initialWaterMeterReading");
  }

  get initialGasMeterReading() {
    return this.leaseAgreementForm.get("initialGasMeterReading");
  }

  get depositReturnDate() {
    return this.leaseAgreementForm.get("depositReturnDate");
  }

  get returnedDepositAmount() {
    return this.leaseAgreementForm.get("returnedDepositAmount");
  }

  get isContractActive() {
    return this.leaseAgreementForm.get("isContractActive");
  }

}
