import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { HousingProviderDto } from '../housing-provider-add/model/housing-provider-dto';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, map, merge, startWith, switchMap, takeUntil } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-housing-provider-list',
  templateUrl: './housing-provider-list.component.html',
  styleUrls: ['./housing-provider-list.component.scss']
})
export class HousingProviderListComponent implements AfterViewInit, OnDestroy {
  private killer$ = new Subject<void>();
  displayedColumns: string[] = [
    "name", "type", "tax", "actions"
  ];
  totalElements: number = 0;
  housingProviders: HousingProviderDto[] = [];
  isLoadingResults: boolean = true;
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
    const dtDefinition = 'APARTMENT_HOUSING_PROVIDER';
    const filter = {};
  
    this.sort.sortChange
    .pipe(takeUntil(this.killer$))
    .subscribe(() => (this.paginator.pageIndex = 0));
  
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
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
        this.isLoadingResults = false;
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

}
