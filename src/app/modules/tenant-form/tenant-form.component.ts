import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tenant-form',
  template: `
  <div [formGroup]="parentForm" >
    <mat-form-field appearance="outline">
        <mat-label>Imię</mat-label>
        <input matInput formControlName="firstname">
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Nazwisko</mat-label>
        <input matInput formControlName="lastname">
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Adres email</mat-label>
        <input matInput formControlName="email">
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Numer konta bankowego</mat-label>
        <input matInput formControlName="accountNumber">
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Numer telefonu</mat-label>
        <input matInput formControlName="phoneNumber">
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>{{ 'apartment.street' | translate }}</mat-label>
        <input matInput formControlName="streetName">
        <mat-error *ngIf="streetName?.invalid && (streetName?.dirty || streetName?.touched)">
            {{getStreetNameErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>{{ 'apartment.buildingNumber' | translate }}</mat-label>
        <input matInput formControlName="buildingNumber">
        <mat-error *ngIf="buildingNumber?.invalid && (buildingNumber?.dirty || buildingNumber?.touched)">
            {{getBuildingNumberErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>{{ 'apartment.apartmentNumber' | translate }}</mat-label>
        <input matInput formControlName="apartmentNumber">
        <mat-error *ngIf="apartmentNumber?.invalid && (apartmentNumber?.dirty || apartmentNumber?.touched)">
            {{getApartmentNumberErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>{{ 'apartment.zipCode' | translate }}</mat-label>
        <input matInput formControlName="zipCode">
        <mat-error *ngIf="zipCode?.invalid && (zipCode?.dirty || zipCode?.touched)">
            {{getZipCodeErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>{{ 'apartment.cityName' | translate }}</mat-label>
        <input matInput formControlName="cityName">
        <mat-error *ngIf="cityName?.invalid && (cityName?.dirty || cityName?.touched)">
            {{getCityNameErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>{{ 'apartment.voivodeship' | translate }}</mat-label>
        <input matInput formControlName="voivodeship">
        <mat-error *ngIf="voivodeship?.invalid && (voivodeship?.dirty || voivodeship?.touched)">
            {{getVoivodeshipErrorMsg()}}
        </mat-error>
    </mat-form-field>


    <mat-form-field appearance="fill">
        <mat-label>Podaj okres umowy</mat-label>
        <mat-date-range-input [formGroup]="parentForm" [rangePicker]="pickerContractPeriod">
            <input matStartDate formControlName="startContractDate" placeholder="Data początkowa">
            <input matEndDate formControlName="endContractDate" placeholder="Data końcowa">
        </mat-date-range-input>
        <mat-datepicker-toggle matIconSuffix [for]="pickerContractPeriod"></mat-datepicker-toggle>
        <mat-date-range-picker #pickerContractPeriod></mat-date-range-picker>
        <mat-error *ngIf="this.startContractDate?.invalid">
            {{getStartContractDateErrorMsg()}}
        </mat-error>
    </mat-form-field>
    

    <mat-form-field appearance="outline">
        <mat-label>Kaucja</mat-label>
        <input matInput formControlName="deposit" type="number">
        <span matTextSuffix>zł</span>
        <mat-error *ngIf="this.deposit?.invalid">
            {{getDepositErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Wpłacona kaucja</mat-label>
        <input matInput formControlName="depositPaid" type="number">
        <span matTextSuffix>zł</span>
        <mat-error *ngIf="this.depositPaid?.invalid">
            {{getDepositPaidErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field>
        <mat-label>Termin płatności</mat-label>
        <mat-select formControlName="paymentDueDayOfMonth">
            <mat-option *ngFor="let number of daysOfMonth" [value]="number">
                {{number}}
            </mat-option>
        </mat-select>
        <mat-error *ngIf="this.paymentDueDayOfMonth?.invalid">
            {{getPaymentDueDateErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Kwota czynszu</mat-label>
        <input matInput formControlName="rentAmount" type="number">
        <span matTextSuffix>zł</span>
        <mat-error *ngIf="this.rentAmount?.invalid">
            {{getRentAmountErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Kwota odstępnego</mat-label>
        <input matInput formControlName="compensationAmount" type="number">
        <span matTextSuffix>zł</span>
        <mat-error *ngIf="this.compensationAmount?.invalid">
            {{getCompensationAmountErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Kwota za internet</mat-label>
        <input matInput formControlName="internetFee" type="number">
        <span matTextSuffix>zł</span>
        <mat-error *ngIf="this.internetFee?.invalid">
            {{getInternetFeeErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Opłata za gaz</mat-label>
        <input matInput formControlName="gasDeposit" type="number">
        <span matTextSuffix>zł</span>
        <mat-error *ngIf="this.gasDeposit?.invalid">
            {{getGasDepositErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Ilość wliczonej wody</mat-label>
        <input matInput formControlName="includedWaterMeters" type="number">
        <span matTextSuffix>m³&nbsp;</span>
        <mat-error *ngIf="this.includedWaterMeters?.invalid">
            {{getIncludedWaterMetersErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Początkowy odczyt energii</mat-label>
        <input matInput formControlName="initialEnergyMeterReading" type="number">
        <span matTextSuffix>kWh</span>
        <mat-error *ngIf="this.initialEnergyMeterReading?.invalid">
            {{getInitialEnergyMeterReadingErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Początkowy odczyt wody</mat-label>
        <input matInput formControlName="initialWaterMeterReading" type="number">
        <span matTextSuffix>m³&nbsp;</span>
        <mat-error *ngIf="this.initialWaterMeterReading?.invalid">
            {{getInitialWaterMeterReadingErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Początkowy odczyt gazu</mat-label>
        <input matInput formControlName="initialGasMeterReading" type="number">
        <span matTextSuffix>m³&nbsp;</span>
        <mat-error *ngIf="this.initialGasMeterReading?.invalid">
            {{getInitialGasMeterReadingErrorMsg()}}
        </mat-error>
    </mat-form-field>

    <mat-form-field appearance="fill">
        <mat-label>Data zwrotu kaucji</mat-label>
        <input matInput [matDatepicker]="pickerDepositReturnDate" formControlName="depositReturnDate">
        <mat-datepicker-toggle matIconSuffix [for]="pickerDepositReturnDate"></mat-datepicker-toggle>
        <mat-datepicker #pickerDepositReturnDate></mat-datepicker>
    </mat-form-field>

    <mat-form-field appearance="outline">
        <mat-label>Kwota zwróconej kaucji</mat-label>
        <input matInput formControlName="returnedDepositAmount" type="number">
        <span matTextSuffix>zł</span>
        <mat-error *ngIf="this.returnedDepositAmount?.invalid">
            {{getReturnedDepositAmountErrorMsg()}}
        </mat-error>
    </mat-form-field>
    
    <mat-checkbox class="checkbox" color="primary" formControlName="contractActive">Czy aktywna umowa</mat-checkbox>
    
    <button mat-flat-button style="background-color: black; color: white;">Zapisz</button>
  </div>
  `
})
export class TenantFormComponent {
  @Input() parentForm!: FormGroup;
  daysOfMonth: number[] = [];

  constructor() {
    this.daysOfMonth = [...Array.from({ length: 28 }, (_, index) => index)];
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
    return this.parentForm.get("firstname");
  }

  get lastname() {
    return this.parentForm.get("lastname");
  }

  get email() {
    return this.parentForm.get("email");
  }

  get accountNumber() {
    return this.parentForm.get("accountNumber");
  }

  get phoneNumber() {
    return this.parentForm.get("phoneNumber");
  }

  get streetName() {
    return this.parentForm.get("streetName");
  }

  get buildingNumber() {
    return this.parentForm.get("buildingNumber");
  }

  get apartmentNumber() {
    return this.parentForm.get("apartmentNumber");
  }

  get zipCode() {
    return this.parentForm.get("zipCode");
  }

  get cityName() {
    return this.parentForm.get("cityName");
  }

  get voivodeship() {
    return this.parentForm.get("voivodeship");
  }

  get startContractDate() {
    return this.parentForm.get("startContractDate");
  }

  get endContractDate() {
    return this.parentForm.get("endContractDate");
  }

  get deposit() {
    return this.parentForm.get("deposit");
  }

  get depositPaid() {
    return this.parentForm.get("depositPaid");
  }

  get paymentDueDayOfMonth() {
    return this.parentForm.get("paymentDueDayOfMonth");
  }

  get rentAmount() {
    return this.parentForm.get("rentAmount");
  }

  get compensationAmount() {
    return this.parentForm.get("compensationAmount");
  }

  get internetFee() {
    return this.parentForm.get("internetFee");
  }

  get gasDeposit() {
    return this.parentForm.get("gasDeposit");
  }

  get includedWaterMeters() {
    return this.parentForm.get("includedWaterMeters");
  }

  get initialEnergyMeterReading() {
    return this.parentForm.get("initialEnergyMeterReading");
  }

  get initialWaterMeterReading() {
    return this.parentForm.get("initialWaterMeterReading");
  }

  get initialGasMeterReading() {
    return this.parentForm.get("initialGasMeterReading");
  }

  get depositReturnDate() {
    return this.parentForm.get("depositReturnDate");
  }

  get returnedDepositAmount() {
    return this.parentForm.get("returnedDepositAmount");
  }

  get contractActive() {
    return this.parentForm.get("contractActive");
  }
}
