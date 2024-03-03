import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, map, merge, startWith, switchMap, takeUntil } from 'rxjs';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { MeterRowDto } from './model/meter-row-dto';

@Component({
  selector: 'app-meter-list',
  templateUrl: './meter-list.component.html',
  styleUrls: ['./meter-list.component.scss']
})
export class MeterListComponent implements AfterViewInit, OnDestroy {
  private killer$ = new Subject<void>();
  displayedColumns: string[] = [
    "apartment", "rentedObject", "meterName", "meterType", "meterNumber",
    "initialMeterReading", "installationDate", "actions"
  ];
  totalElements: number = 0;
  meters: MeterRowDto[] = [];
  searchInput!: UntypedFormControl;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dtService: DTService) {
    this.searchInput = new UntypedFormControl();
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
    const dtDefinition = 'METER';
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
        return data as MeterRowDto[];
      })
    ).pipe(takeUntil(this.killer$))
    .subscribe(data => this.meters = data);
  }
}
