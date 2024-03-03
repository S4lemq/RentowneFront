import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MeterService } from './meter.service';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MeterType } from './model/meter-type';
import { ActivatedRoute, Router } from '@angular/router';
import { RentedObjectService } from '../apartment-add/rented-object.service';
import { TranslateService } from '@ngx-translate/core';
import { MeterDto } from './model/meter-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';
import { NavigationService } from '../common/service/navigation.service';
import { BaseComponent } from '../common/base.component';

@Component({
  selector: 'app-meter-edit',
  templateUrl: './meter-edit.component.html',
  styleUrls: ['./meter-edit.component.scss']
})
export class MeterEditComponent implements OnInit, OnDestroy, BaseComponent {
  
  private killer$ = new Subject<void>();
  rentedObjectId!: number;
  meterForm!: FormGroup;
  meterTypes = Object.values(MeterType);
  rentedObjects: RentedObjectDto[] = [];
  meterId!: number;
  isFormSubmitted: boolean = false;
  isFormValid = () => this.isFormSubmitted || !this.meterForm?.dirty;

  constructor(
    private meterService: MeterService,
    private acitvatedRoute: ActivatedRoute,
    private rentedObjectService: RentedObjectService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private router: Router,
    private navigationService: NavigationService
    ) {}

  ngOnInit(): void {
    this.meterId = Number(this.acitvatedRoute.snapshot.params['id']);
    this.getMeter();

    this.rentedObjectService.getAllRentedObjects()
      .pipe(takeUntil(this.killer$))
      .subscribe(data => this.rentedObjects = data);
  
    this.meterForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      meterType: new FormControl('', Validators.required),
      rentedObjectId: new FormControl('', Validators.required),
      meterNumber: new FormControl('', [Validators.minLength(4), Validators.maxLength(20)]),
      initialMeterReading: new FormControl('', [Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]),
      installationDate: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  goBack() {
    this.navigationService.setLastTabLabel('meters');
    this.navigationService.goBack();
  }

  getMeter() {
    this.meterService.getMeterDto(this.meterId)
    .pipe(takeUntil(this.killer$))
    .subscribe(meter => {
      this.mapFormValues(meter);
    })
  }

  submit() {
    if (this.meterForm.valid) {
      this.isFormSubmitted = true;
      this.meterService.updateMeter(
        {
          id: this.meterId,
          name: this.name?.value,
          meterType: this.meterType?.value,
          rentedObject: { id: this.rentedObjectIdControl?.value },
          meterNumber: this.meterNumber?.value,
          initialMeterReading: this.initialMeterReading?.value,
          installationDate: this.installationDate?.value,
        } as MeterDto,
      ).pipe(takeUntil(this.killer$))
      .subscribe(() => {
        this.router.navigate(["/meters/edit", this.meterId])
        .then(() => {
          const translatedText = this.translateService.instant("snackbar.meterSaved");
          this.snackBar.open(translatedText, '', {duration: 3000, panelClass: ['snackbarSuccess']});
        })
      });
    } else {
      this.meterForm.markAllAsTouched();
    }
  }
  

  mapFormValues(meter: MeterDto): void {
    this.meterForm.patchValue({
      name: meter.name,
      meterType: meter.meterType,
      rentedObjectId: meter.rentedObject?.id,
      meterNumber: meter.meterNumber,
      initialMeterReading: meter.initialMeterReading,
      installationDate: meter.installationDate
    });
  }

  getInitialMeterReadingErrorMsg(): string {
    if (this.initialMeterReading?.hasError('min')) {
      return 'Minimalnie 0m³';
    }
    if (this.initialMeterReading?.hasError('maxlength')) {
      return 'Maksymalnie 99999m³';
    }
    if (this.initialMeterReading?.hasError('maxDecimalPlaces')) {
      return "Maksymalnie 5 miejsca po przecinku"
    }
    return '';
  }

  getMeterNumberErrorMsg(): string {
    if (this.meterNumber?.hasError('minlength')) {
      return 'Minimalnie 4';
    }
    if (this.meterNumber?.hasError('maxlength')) {
      return 'Maksymalnie 20';
    }
    return '';
  }

  getRentedObjectErrorMsg(): string {
    if (this.rentedObjectIdControl?.hasError('required')) {
      return 'Wartość wymagana';
    }
    return '';
  }

  getMeterTypeErrorMsg(): string {
    if (this.meterType?.hasError('required')) {
      return 'Wartość wymagana';
    }
    return '';
  }

  getNametErrorMsg(): string {
    if (this.name?.hasError('required')) {
      return 'Wartość wymagana';
    }
    if (this.name?.hasError('minlength')) {
      return 'Minimalnie 1';
    }
    if (this.name?.hasError('maxlength')) {
      return 'Maksymalnie 32';
    }
    return '';
  }

  get name() {
    return this.meterForm.get("name");
  }

  get meterType() {
    return this.meterForm.get("meterType");
  }

  get rentedObjectIdControl() {
    return this.meterForm.get("rentedObjectId");
  }

  get meterNumber() {
    return this.meterForm.get("meterNumber");
  }

  get initialMeterReading() {
    return this.meterForm.get("initialMeterReading");
  }

  get installationDate() {
    return this.meterForm.get("installationDate");
  }

}
