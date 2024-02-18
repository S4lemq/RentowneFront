import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, map, merge, startWith, switchMap, takeUntil } from 'rxjs';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { TenantRowDto } from './model/tenant-row-dto';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements AfterViewInit, OnDestroy {
  
  private killer$ = new Subject<void>();
  displayedColumns: string[] = [
    "firstname", "lastname", "apartmentName", "rentedObjectName", "phoneNumber",
    "email", "endContractDate", "actions"
  ];
  totalElements: number = 0;
  tenants: TenantRowDto[] = [];
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
    this.loadTenants('');
  }

  onSearchClick() {
    let search = this.searchInput.value;
    if (search != null) { 
      this.loadTenants(search);
    }
  }

  onCleanSearchClick() {
    this.searchInput.setValue("");
    this.loadTenants('');
  }

  loadTenants(text: string) {
    const dtDefinition = 'TENANT';
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
        return data as TenantRowDto[];
      })
    ).pipe(takeUntil(this.killer$))
    .subscribe(data => this.tenants = data);
  }

}
