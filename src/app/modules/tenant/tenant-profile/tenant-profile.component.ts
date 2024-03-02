import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TenantSettlementService } from '../tenant-settlement/tenant-settlement.service';
import { BasicSettlementDto } from './model/basic-settlement-dto';
import { TenantSettlementDto } from './model/tenant-settlement-dto';
import { TenantSettlementSummary } from './model/tenant-settlement-summary';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tenant-profile',
  templateUrl: './tenant-profile.component.html',
  styleUrls: ['./tenant-profile.component.scss']
})
export class TenantProfileComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();

  formGroup!: FormGroup;
  initData?: BasicSettlementDto;
  tenantSettlementSummary!: TenantSettlementSummary;

  constructor(
    private tenantSettlementService: TenantSettlementService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      payment: new FormControl('', Validators.required)
    });
    this.tenantSettlementService.getBasicSettlementData()
      .pipe(takeUntil(this.killer$))
      .subscribe((data: BasicSettlementDto) => {
        this.initData = data;
        this.setDefaultPayment();
      });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  setDefaultPayment() {
    const defaultPaymentId = this.initData?.payment.find(payment => payment.defaultPayment)?.id;
    if (defaultPaymentId !== undefined) {
      this.formGroup.patchValue({payment: defaultPaymentId});
    }
  }
  

  submit() {
    this.tenantSettlementService.placeSettlement(
      { totalAmount: this.initData?.totalAmount,
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
