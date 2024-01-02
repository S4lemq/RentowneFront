
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { Apartment } from './apartment';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent implements OnInit, OnDestroy {

  apartments: Apartment[] = [];
  totalElements: number = 0;

  private killer$: Subject<void> = new Subject<void>()

  constructor(private dtService: DTService){}

  ngOnInit(): void {
    this.getApartmentPage(0, 10);
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  onPageEvent(event: PageEvent) {
    this.getApartmentPage(event.pageIndex, event.pageSize);
  }

  pinApartment() {
    
  }

  private getApartmentPage(page: number, size: number) {
    const dtDefinition = 'APARTMENT';
    const text = '';
    const filter = {};

    this.dtService.getItemsCount(dtDefinition, text, filter).subscribe(
      value => this.totalElements = value 
    );

    this.dtService.getItems(
      dtDefinition,
      page * size,
      size,
      "NONE",
      '',
      text,
      filter
    ).subscribe(
      data => this.apartments = data as Apartment[]
    )
  }

}
