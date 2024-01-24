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

@Component({
  selector: 'app-meter-edit',
  templateUrl: './meter-edit.component.html',
  styleUrls: ['./meter-edit.component.scss']
})
export class MeterEditComponent implements OnInit, OnDestroy {
  
  private killer$ = new Subject<void>();
  rentedObjectId!: number;
  meterForm!: FormGroup;
  meterTypes = Object.values(MeterType);
  rentedObjects: RentedObjectDto[] = [];
  meterId!: number;

  constructor(
    private meterService: MeterService,
    private acitvatedRoute: ActivatedRoute,
    private rentedObjectService: RentedObjectService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.meterId = Number(this.acitvatedRoute.snapshot.params['id']);
    this.getMeter();

    this.rentedObjectService.getAllRentedObjects()
      .pipe(takeUntil(this.killer$))
      .subscribe(data => this.rentedObjects = data);
  
    this.meterForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      meterType: new FormControl('', Validators.required),
      rentedObjectId: new FormControl('', Validators.required)
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
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
      this.meterService.updateMeter(
        {
          id: this.meterId,
          name: this.name?.value,
          meterType: this.meterType?.value,
          rentedObject: { id: this.rentedObjectIdControl?.value }
        } as MeterDto,
      ).pipe(takeUntil(this.killer$))
      .subscribe(meter => {
        this.snackBar.open("Licznik został zapisany", '', {
          duration: 3000,
          panelClass: ['snackbarSuccess']
        });
      });
    } else {
      this.meterForm.markAllAsTouched();
    }
  }
  

  mapFormValues(meter: MeterDto): void {
    this.meterForm.patchValue({
      name: meter.name,
      meterType: meter.meterType,
      rentedObjectId: meter.rentedObject?.id
    });
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

}
