
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, merge, startWith, switchMap } from 'rxjs';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { Apartment } from './apartment';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent implements AfterViewInit {

  displayedColumns: string[] = [
    "id", "apartmentName", "leasesNumber", "isRented"
  ];
  totalElements: number = 0;
  apartments: Apartment[] = [];
  isLoadingResults: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dtService: DTService){}

  ngAfterViewInit(): void {
    const dtDefinition = 'APARTMENT';
    const text = ''; // Zastąp '' tekstem do wyszukiwania
    const filter = {}; // Tutaj możesz przekazać obiekt filtru, jeśli jest potrzebny

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

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
              filter);
      }),
      map(data => {
        this.isLoadingResults = false;
        this.dtService.getItemsCount(dtDefinition, text, filter).subscribe(
          value => this.totalElements = value 
        );
        return data as Apartment[];
      })
    ).subscribe(data => this.apartments = data);
  }

}
