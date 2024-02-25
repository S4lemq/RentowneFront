import { Component, OnDestroy, OnInit } from '@angular/core';
import { TenantSettlementService } from '../tenant/tenant-settlement/tenant-settlement.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tenant-settlement-notification',
  templateUrl: './tenant-settlement-notification.component.html',
  styleUrls: ['./tenant-settlement-notification.component.scss']
})
export class TenantSettlementNotificationComponent implements OnInit, OnDestroy {
  private killer$ = new Subject<void>();
  status = false;

  constructor(
    private tenantSettlementService: TenantSettlementService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getStatus();
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  getStatus() {
    let hash = this.activatedRoute.snapshot.params['orderHash'];
    this.tenantSettlementService.getStatus(hash)
      .pipe(takeUntil(this.killer$))
      .subscribe(status => this.status = status.paid);
  }
}
