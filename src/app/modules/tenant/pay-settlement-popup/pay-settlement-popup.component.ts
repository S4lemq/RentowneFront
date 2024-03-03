import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { TenantSettlementSummary } from '../tenant-profile/model/tenant-settlement-summary';
import { TenantSettlementService } from '../tenant-profile/tenant-settlement.service';
import { Payment } from '../tenant-profile/model/payment';
import { TenantSettlementDto } from '../tenant-profile/model/tenant-settlement-dto';

@Component({
  selector: 'app-pay-settlement-popup',
  templateUrl: './pay-settlement-popup.component.html',
  styleUrls: ['./pay-settlement-popup.component.scss']
})
export class PaySettlementPopupComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();
  
  formGroup!: FormGroup;
  paymentMethods?: Array<Payment>;
  tenantSettlementSummary!: TenantSettlementSummary;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<PaySettlementPopupComponent>,
    private tenantSettlementService: TenantSettlementService
    ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      payment: new FormControl('', Validators.required)
    });
    this.tenantSettlementService.getPaymentMethods()
      .pipe(takeUntil(this.killer$))
      .subscribe(data => {
        this.paymentMethods = data;
        this.setDefaultPayment();
      });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  closePopup() {
    this.ref.close();
  }
  
  setDefaultPayment() {
    const defaultPaymentId = this.paymentMethods?.find(payment => payment.defaultPayment)?.id;
    if (defaultPaymentId !== undefined) {
      this.formGroup.patchValue({payment: defaultPaymentId});
    }
  }
  

  submit() {
    this.tenantSettlementService.placeSettlement(
      { totalAmount: this.data.totalAmount,
        paymentId: this.payment?.value
      } as TenantSettlementDto
    ).pipe(takeUntil(this.killer$))
    .subscribe((summary: TenantSettlementSummary) => {
        if (summary.redirectUrl) {
          window.location.href = summary.redirectUrl;
        } else {
          this.tenantSettlementSummary = summary;
        }
      }
    )
  }

  get payment() {
    return this.formGroup.get("payment");
  }

}
