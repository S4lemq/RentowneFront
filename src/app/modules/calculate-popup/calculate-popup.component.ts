import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { maxDecimalPlaces } from '../common/validators/max-decimal-places.validator';
import { MeterDto } from '../meter-edit/model/meter-dto';
import { SettlementService } from '../single-rented-object-settlement-list/settlement.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-calculate-popup',
  templateUrl: './calculate-popup.component.html',
  styleUrls: ['./calculate-popup.component.scss']
})
export class CalculatePopupComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();
  calculateForm!: FormGroup;
  inputData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<CalculatePopupComponent>,
    private service: SettlementService,
    private activatedRoute: ActivatedRoute) {}


  ngOnInit(): void {
    this.inputData = this.data;
    this.calculateForm = new FormGroup({
      waterIncluded: new FormControl(false),
      electricityIncluded: new FormControl(false)
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  calculate() {
    this.service.calculate(
      this.inputData.rentedObjectId,
      this.waterIncludedControl?.value,
      this.electricityIncludedControl?.value
    )
    .pipe(takeUntil(this.killer$))
    .subscribe(() => this.closePopup());
  }

  closePopup() {
    this.ref.close();
  }

  get waterIncludedControl() {
    return this.calculateForm.get("waterIncluded");
  }

  get electricityIncludedControl() {
    return this.calculateForm.get("electricityIncluded");
  }

}
