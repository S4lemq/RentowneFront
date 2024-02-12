import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';
import { MeterDto } from '../meter-edit/model/meter-dto';
import { MeterReadingService } from './meter-reading.service';
import { MeterReadingDto } from './model/meter-reading-dto';

@Component({
  selector: 'app-meter-reading-add-popup',
  templateUrl: './meter-reading-add-popup.component.html',
  styleUrls: ['./meter-reading-add-popup.component.scss']
})
export class MeterReadingAddPopupComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();
  inputData: any;
  meterReadingForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<MeterReadingAddPopupComponent>,
    private service: MeterReadingService) {}

  ngOnInit(): void {
    this.inputData = this.data;

    this.service.getMeterReadingByMeter(this.inputData.meterId)
    .pipe(takeUntil(this.killer$))
    .subscribe(data => {
      this.mapFormValues(data);
    });

    this.meterReadingForm = new FormGroup({
      currentReading: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]),
      readingDate: new FormControl('', Validators.required),
      previousReading: new FormControl({value: '', disabled: true}),
      previousReadingDate: new FormControl({value: '', disabled: true}),
    });
    
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  mapFormValues(dto: MeterReadingDto): void {
    this.meterReadingForm.patchValue({
      previousReading: dto.currentReading,
      previousReadingDate: dto.readingDate
    });
  }

  saveMeterReading() {
    if (this.meterReadingForm.valid) {
      const meterDto: MeterDto = {
        id: this.inputData.meterId
      }
      this.service.saveMeterReading(
        {
          currentReading: this.currentReadingControl?.value,
          readingDate: this.readingDateControl?.value,
          meterDto: meterDto,
          previousReading: this.previousReadingControl?.value,
          previousReadingDate: this.previousReadingDateControl?.value
        } as MeterReadingDto
      ).pipe(takeUntil(this.killer$))
      .subscribe({
        next: () => {
          this.closePopup();
        },
        error: err => {
          if (err.error?.message === 'BAD_METER_READING_VALUES') {
            this.currentReadingControl?.setErrors({ server: true });
          }
          if (err.error?.message === 'BAD_METER_READING_DATE') {
            this.readingDateControl?.setErrors({ server: true });
          }
        }
      });
    } else {
      this.meterReadingForm.markAllAsTouched();
    }
  }

  getCurrentReadingErrorMsg(): string {
    if (this.currentReadingControl?.hasError('min')) {
      return 'Minimalnie 0m³';
    }
    if (this.currentReadingControl?.hasError('maxlength')) {
      return 'Maksymalnie 99999m³';
    }
    if (this.currentReadingControl?.hasError('maxDecimalPlaces')) {
      return "Maksymalnie 5 miejsca po przecinku"
    }
    if(this.currentReadingControl?.hasError('required')) {
      return "Wartość wymagana";
    }
    if (this.currentReadingControl?.hasError('server')) {
      return "Musi być większe niż wartość poprzedniego odczytu";
    }
    return '';
  }

  getReadingDateErrorMsg(): string {
    if (this.readingDateControl?.hasError('required')) {
      return 'Wartość wymagana'
    }
    if (this.readingDateControl?.hasError('server')) {
      return 'Musi być większy o miesiąc niż poprzednia data odczytu'
    }
    return '';
  }

  getErrorClass(): string {
    let styleClass = '';
    if (this.meterReadingForm.hasError('dateDifferenceInvalid')) {
      styleClass = 'error-code-visible';
    } else {
      styleClass = 'error-code-empty';
    }
    return styleClass;
  }

  getErrorDateClass(): string {
    let styleClass = '';
    if (this.meterReadingForm.hasError('dateDifferenceInvalid')) {
      styleClass = 'date-error';
    } else {
      styleClass = 'date';
    }
    return styleClass;
  }

  closePopup() {
    this.ref.close();
  }

  get currentReadingControl() {
    return this.meterReadingForm.get("currentReading");
  }

  get readingDateControl() {
    return this.meterReadingForm.get("readingDate");
  }

  get previousReadingControl() {
    return this.meterReadingForm.get("previousReading");
  }

  get previousReadingDateControl() {
    return this.meterReadingForm.get("previousReadingDate");
  }

}
