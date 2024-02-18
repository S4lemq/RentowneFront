import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, merge, startWith, switchMap, takeUntil } from 'rxjs';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { CalculatePopupComponent } from '../calculate-popup/calculate-popup.component';
import { SingleRentedObjectSettlementExportPopupComponent } from '../single-rented-object-settlement-export-popup/single-rented-object-settlement-export-popup.component';
import { SingleRentedObjectSettlementRowDto } from './model/single-rented-object-settlement-row-dto';


@Component({
  selector: 'app-single-rented-object-settlement-list',
  templateUrl: './single-rented-object-settlement-list.component.html',
  styleUrls: ['./single-rented-object-settlement-list.component.scss']
})
export class SingleRentedObjectSettlementListComponent implements OnInit, AfterViewInit, OnDestroy {

  private killer$ = new Subject<void>();
  displayedColumns: string[] = [
    "date", "compensationAmount", "rentAmount", "internetFee", "gasDeposit", "electricityAmount", "waterAmount", "totalAmount"
  ];
  totalElements: number = 0;
  singleRentedObjectSettlements: SingleRentedObjectSettlementRowDto[] = [];
  searchInput!: UntypedFormControl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  financeId!: number;

  constructor(
    private dtService: DTService,
    private acitvatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
    this.searchInput = new UntypedFormControl();
  }

  ngOnInit(): void {
    this.financeId = Number(this.acitvatedRoute.snapshot.params['id']);
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  ngAfterViewInit(): void {
    this.loadData('');
  }

  onSearchClick() {
    let search = this.searchInput.value;
    if (search != null) { 
      this.loadData(search);
    }
  }

  onCleanSearchClick() {
    this.searchInput.setValue("");
    this.loadData('');
  }

  loadData(text: string) {
    const dtDefinition = 'SETTLEMENT';
    const filter = {
      "rentedObjectId": this.financeId
    };
  
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
            text,
            filter
          );
      }),
      map(data => {
        this.dtService.getItemsCount(dtDefinition, text, filter)
        .pipe(takeUntil(this.killer$))
        .subscribe(
          value => this.totalElements = value 
        );
        return data as SingleRentedObjectSettlementRowDto[];
      })
    ).pipe(takeUntil(this.killer$))
    .subscribe(data => this.singleRentedObjectSettlements = data);
  }

  openPopup() {
    let _popup = this.dialog.open(CalculatePopupComponent,{
      width: '25%',
      data: {
        rentedObjectId: this.financeId
      }
    });
    _popup.afterClosed()
    .pipe(takeUntil(this.killer$))
    .subscribe(() => {
      this.loadData('');
    });
  }

  openExportPopup() {
    this.dialog.open(SingleRentedObjectSettlementExportPopupComponent,{
      width: '50%',
      data: {
        rentedObjectId: this.financeId
      }
    });
  }

}
