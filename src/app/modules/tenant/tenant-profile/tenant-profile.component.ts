import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, map, merge, startWith, switchMap, takeUntil } from 'rxjs';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { PaySettlementPopupComponent } from '../pay-settlement-popup/pay-settlement-popup.component';
import { TenantSettlementRowDto } from './model/tenant-settlement-row-do';

@Component({
  selector: 'app-tenant-profile',
  templateUrl: './tenant-profile.component.html',
  styleUrls: ['./tenant-profile.component.scss']
})
export class TenantProfileComponent implements AfterViewInit, OnDestroy {

  private killer$ = new Subject<void>();
  displayedColumns: string[] = [
    "settlementDate", "totalAmount", "settlementStatus", "actions"
  ];
  totalElements: number = 0;
  settlements: TenantSettlementRowDto[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dtService: DTService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.loadSettlements();
  }

  openPopup(totalAmount: number, settlementDate: Date) {
    let _popup = this.dialog.open(PaySettlementPopupComponent,{
      width: '60%',
      data: {
        title: "Opłać najem",
        totalAmount: totalAmount,
        settlementDate: settlementDate
      }
    });
    _popup.afterClosed()
    .pipe(takeUntil(this.killer$))
    .subscribe(() => {
      this.loadSettlements();
    });
  }

  loadSettlements() {
    const dtDefinition = 'TENANT_SETTLEMENT';
    const filter = {};
  
    this.sort.sortChange.pipe(takeUntil(this.killer$))
    .subscribe(() => (this.paginator.pageIndex = 0));
  
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          const sortColumn = this.sort.active;
          let sortOrder = this.sort.direction ? this.sort.direction.toUpperCase() : 'ASC';
  
          if (this.sort.active != null && this.sort.direction == '') {
            sortOrder = 'NONE';
          }
  
          return this.dtService.getItems(dtDefinition,
            this.paginator.pageIndex * this.paginator.pageSize,
            this.paginator.pageSize,
            sortOrder,
            sortColumn,
            '',
            filter
          );
      }),
      map(data => {
        this.dtService.getItemsCount(dtDefinition, '', filter)
        .pipe(takeUntil(this.killer$))
        .subscribe(
          value => this.totalElements = value 
        );
        return data as TenantSettlementRowDto[];
      })
    ).pipe(takeUntil(this.killer$))
    .subscribe(data => this.settlements = data);
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }
  
}
