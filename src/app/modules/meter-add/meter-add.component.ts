import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MeterService } from '../meter-edit/meter.service';
import { MeterDto } from '../meter-edit/model/meter-dto';
import { MeterType } from '../meter-edit/model/meter-type';
import { RentedObjectService } from '../apartment-add/rented-object.service';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';

@Component({
  selector: 'app-meter-add',
  templateUrl: './meter-add.component.html',
  styleUrls: ['./meter-add.component.scss']
})
export class MeterAddComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();
  rentedObjectId!: number;
  meterForm!: FormGroup;
  meterTypes = Object.values(MeterType);
  rentedObjects: RentedObjectDto[] = [];

  constructor(
    private meterService: MeterService,
    private route: ActivatedRoute,
    private rentedObjectService: RentedObjectService,
    private translateService: TranslateService,
    private router: Router,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.rentedObjectService.getAllRentedObjects()
      .pipe(takeUntil(this.killer$))
      .subscribe(data => this.rentedObjects = data);

    this.route.params.pipe(takeUntil(this.killer$)).subscribe(params => {
      this.rentedObjectId = +params['id'];
    });
  
    this.meterForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      meterType: new FormControl('', Validators.required),
      rentedObjectId: new FormControl(this.rentedObjectId, Validators.required),
      meterNumber: new FormControl('', [Validators.minLength(4), Validators.maxLength(20)]),
      initialMeterReading: new FormControl('', [Validators.min(0), Validators.max(99999), maxDecimalPlaces(5)]),
      installationDate: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  submit() {
    if (this.meterForm.valid) {
      const rentedObjectDto: RentedObjectDto = {
        id: this.rentedObjectIdControl?.value
      }
      this.meterService.saveMeter(
        {
          name: this.name?.value,
          meterType: this.meterType?.value,
          rentedObject: rentedObjectDto,
          meterNumber: this.meterNumber?.value,
          initialMeterReading: this.initialMeterReading?.value,
          installationDate: this.installationDate?.value,
        } as MeterDto
      ).pipe(takeUntil(this.killer$))
      .subscribe(meter => {
        const translatedText = this.translateService.instant("snackbar.meterAdded");
        this.router.navigate(["meters/edit/", meter.id])
            .then(() => this.snackBar.open(translatedText, '', {
                duration: 3000,
                panelClass: ['snackbarSuccess']
            }));
      });
    } else {
      this.meterForm.markAllAsTouched();
    }
  }

  getUnit(meterType: MeterType | null): string {
    if (!meterType) {
      return '';
    }
  
    switch (meterType) {
      case MeterType.WATER_COLD:
      case MeterType.WATER_WARM:
      case MeterType.GAS:
        return 'm³';
      case MeterType.ELECTRIC:
        return 'kWh';
      case MeterType.HEAT:
        return 'GJ';
      default:
        return '';
    }
  }

  getInitialMeterReadingErrorMsg(): string {
    if (this.initialMeterReading?.hasError('min')) {
      return 'Minimalnie 0m³';
    }
    if (this.initialMeterReading?.hasError('max')) {
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