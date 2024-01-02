
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  searchInput!: UntypedFormControl;

  private killer$ = new Subject<void>();

  constructor(private dtService: DTService) {
    this.searchInput = new UntypedFormControl();
  }

  ngOnInit(): void {
    this.loadApartmentPage(0, 10, '');
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  onSearchClick(): void {
    let search = this.searchInput.value;
    if (search != null) { 
      this.loadApartmentPage(0, 10, search);
    }
  }

onCleanSearchClick() {
    this.searchInput.setValue("");
    const search = this.searchInput.value;
    this.loadApartmentPage(0, 10, search);
}

  onPageEvent(event: PageEvent): void {
    this.loadApartmentPage(event.pageIndex, event.pageSize, '');
  }

  private loadApartmentPage(page: number, size: number, text: string): void {
    const dtDefinition = 'APARTMENT';

    this.dtService.getItemsCount(dtDefinition, text, {})
      .pipe(takeUntil(this.killer$))
      .subscribe(value => this.totalElements = value);

    this.dtService.getItems(dtDefinition, page * size, size, "NONE", '', text, {})
      .pipe(takeUntil(this.killer$))
      .subscribe(data => this.apartments = data as Apartment[]);
  }

  pinApartment(): void {
  }
  
}
