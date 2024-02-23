import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TenantSettlementService } from '../tenant-settlement/tenant-settlement.service';
import { BasicSettlementDto } from './model/basic-settlement-dto';
import { TenantSettlementDto } from './model/tenant-settlement-dto';
import { TenantSettlementSummary } from './model/tenant-settlement-summary';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private tenantSettlementService: TenantSettlementService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.tenantSettlementService.getBasicSettlementData()
      .pipe(takeUntil(this.killer$))
      .subscribe((data: BasicSettlementDto) => {
        this.initData = data;
        this.setDefaultPayment();
      });
    this.formGroup = this.formBuilder.group({
      payment:  ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  setDefaultPayment() {
    this.formGroup.patchValue({"payment": this.initData?.payment
      .filter(payment => payment.defaultPayment === true)[0]
    });
  }

  submit() {
    this.tenantSettlementService.placeSettlement(
      { totalAmount: this.initData?.totalAmount,
        paymentId: Number(this.formGroup.get('payment')?.value.id)
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


}
