import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SettlementService } from '../single-rented-object-settlement-list/settlement.service';
import { CalculateRequestDto } from '../single-rented-object-settlement-list/model/calculate-request-dto';

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
    private service: SettlementService) {}


  ngOnInit(): void {
    this.inputData = this.data;
    this.calculateForm = new FormGroup({
      waterIncluded: new FormControl(false),
      electricityIncluded: new FormControl(false),
      settlementDate: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  calculate() {
    this.service.calculate(
      this.inputData.rentedObjectId,
      {
        waterIncluded: this.waterIncludedControl?.value,
        electricityIncluded: this.electricityIncludedControl?.value,
        settlementDate: this.settlementDateControl?.value
      } as CalculateRequestDto
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

  get settlementDateControl() {
    return this.calculateForm.get("settlementDate");
  }

}
