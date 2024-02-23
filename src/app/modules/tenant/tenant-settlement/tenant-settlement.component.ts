import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BasicSettlementDto } from '../tenant-profile/model/basic-settlement-dto';
import { TenantSettlementService } from './tenant-settlement.service';

@Component({
  selector: 'app-tenant-settlement',
  templateUrl: './tenant-settlement.component.html',
  styleUrls: ['./tenant-settlement.component.scss']
})
export class TenantSettlementComponent implements OnInit, OnDestroy {

  private killer$ = new Subject<void>();

  constructor(
    private tenantSettlementService: TenantSettlementService
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }
}
