import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Apartment } from './apartment';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { DTRow } from 'src/app/shared/data-table/DTRow';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    "id", "apartmentName", "leasesNumber", "isRented"
  ];
  totalElements: number = 0;
  apartments: Apartment[] = [];

  constructor(private dtService: DTService){}

  ngAfterViewInit(): void {
    const dtDefinition = 'APARTMENT';
    const sortDirection = 'ASC'; // lub 'DESC', w zależności od potrzeb
    const sortColumnName = ''; // Zastąp 'columnName' nazwą kolumny, po której chcesz sortować
    const text = ''; // Zastąp '' tekstem do wyszukiwania
    const filter = {}; // Tutaj możesz przekazać obiekt filtru, jeśli jest potrzebny

    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.dtService.getItems(dtDefinition, this.paginator.pageIndex, this.paginator.pageSize, sortDirection, sortColumnName, text, filter);
      }),
      map(data => {
        this.dtService.getItemsCount(dtDefinition, text, filter).subscribe(
          value => this.totalElements = value 
        );
        return data as Apartment[];
      })
    ).subscribe(data => this.apartments = data);
  }

}
