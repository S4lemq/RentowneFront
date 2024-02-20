import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { HousingProviderDto } from '../housing-provider-add/model/housing-provider-dto';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, map, merge, startWith, switchMap, takeUntil } from 'rxjs';
import { HousingProviderSelectPopupComponent } from '../housing-provider-select-popup/housing-provider-select-popup.component';

@Component({
  selector: 'app-housing-provider-apartment-list',
  templateUrl: './housing-provider-apartment-list.component.html',
  styleUrls: ['./housing-provider-apartment-list.component.scss']
})
export class HousingProviderApartmentListComponent implements AfterViewInit, OnDestroy {

  private killer$ = new Subject<void>();
  displayedColumns: string[] = [
    "name", "type", "tax"
  ];
  totalElements: number = 0;
  housingProviders: HousingProviderDto[] = [];
  @Input() apartmentId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dtService: DTService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  loadData() {
    const dtDefinition = 'APARTMENT_HOUSING_PROVIDER';
    const text = '';
    const filter = {
      "apartmentId": this.apartmentId
    };
  
    this.sort.sortChange
    .pipe(takeUntil(this.killer$))
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
        return data as HousingProviderDto[];
      })
    ).pipe(takeUntil(this.killer$))
    .subscribe(data => this.housingProviders = data);
  }

  openPopup() {
    let _popup = this.dialog.open(HousingProviderSelectPopupComponent,{
      width: '80%',
      data: {
        apartmentId: this.apartmentId
      }
    });
    _popup.afterClosed()
    .pipe(takeUntil(this.killer$))
    .subscribe(() => {
      this.loadData();
    });
  }

}
