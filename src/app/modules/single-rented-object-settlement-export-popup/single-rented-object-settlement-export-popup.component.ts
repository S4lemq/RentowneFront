import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SettlementService } from '../single-rented-object-settlement-list/settlement.service';


@Component({
  selector: 'app-single-rented-object-settlement-export-popup',
  templateUrl: './single-rented-object-settlement-export-popup.component.html',
  styleUrls: ['./single-rented-object-settlement-export-popup.component.scss']
})
export class SingleRentedObjectSettlementExportPopupComponent implements OnInit, OnDestroy {
  
  private killer$ = new Subject<void>();
  formGroup!: FormGroup;
  inputData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<SingleRentedObjectSettlementExportPopupComponent>,
    private settlementService: SettlementService
    ) {}

  ngOnInit(): void {
    this.inputData = this.data;
    this.formGroup = new FormGroup({
      from: new FormControl('', Validators.required),
      to: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  export() {
    if (this.formGroup.valid) {
      this.settlementService.exportSettlements(
        this.formGroup.get("from")?.value.toISOString(),
        this.formGroup.get("to")?.value.toISOString(),
        this.inputData.rentedObjectId
        )
        .pipe(takeUntil(this.killer$))
        .subscribe(response => {
          let a = document.createElement('a');
          let objectUrl = URL.createObjectURL(response.body);
          a.href = objectUrl;
          a.download = response.headers.get("Content-Disposition");
          a.click();
          URL.revokeObjectURL(objectUrl);
          this.closePopup()
        });
    }
  }

  closePopup() {
    this.ref.close();
  }

}
