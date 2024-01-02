
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { Apartment } from './apartment';
import { KeyValue } from './model/key-value';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent implements OnInit, OnDestroy {
  apartments: Apartment[] = [];
  totalElements: number = 0;
  searchInput!: UntypedFormControl;
  isRented: boolean | null = null;
  leasesNumbers: (number | null)[] = [];
  selectedLeasesNumber: number | null = null;
  selectedSortDirection: string | null = null;
  selectedColumnName: string | null = null;

  sortDirections: KeyValue[] = [
    {value: null, viewValue: null},
    {value: 'ASC', viewValue: 'Rosnąco'},
    {value: 'DESC', viewValue: 'Malejąco'},
  ];
  
  columnsName: KeyValue[] = [
    {value: null, viewValue: null},
    {value: 'apartmentName', viewValue: 'Nazwa mieszkania'},
    {value: 'leasesNumber', viewValue: 'Liczba umów najmu'},
    {value: 'isRented', viewValue: "Czy wynajęto"}
  ];

  private killer$ = new Subject<void>();

  constructor(private dtService: DTService) {
    this.searchInput = new UntypedFormControl();
    this.leasesNumbers = [null, ...Array.from({ length: 21 }, (_, index) => index)];
  }

  ngOnInit(): void {
    this.loadApartmentPage(0, 10, '');
    this.selectedColumnName = null;
    this.selectedSortDirection = null;
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  onCheckboxChange(value: boolean) {
    if (this.isRented === value) {
      this.isRented = null;
    } else {
      this.isRented = value;
    }
  }

  onSearchClick(): void {
    let search = this.searchInput.value;
    if (search != null) { 
      this.loadApartmentPage(0, 10, search);
    }
  }

  onCleanSearchClick() {
    this.searchInput.setValue("");
    this.loadApartmentPage(0, 10, '');
  }

  onPageEvent(event: PageEvent): void {
    this.loadApartmentPage(event.pageIndex, event.pageSize, this.searchInput.value);
  }

  private loadApartmentPage(page: number, size: number, text: string): void {
    const dtDefinition = 'APARTMENT';
    
    
    let filter: Filter = {};
    if (this.isRented != null) {
      filter.isRented = this.isRented;
    }
    if (this.selectedLeasesNumber != null) {
      filter.leasesNumber = this.selectedLeasesNumber;
    }

    if (this.selectedSortDirection == null) {
      this.selectedSortDirection = 'NONE';
    }

    if (this.selectedColumnName == null) {
      this.selectedColumnName = '';
    }


    this.dtService.getItemsCount(dtDefinition, text, filter)
      .pipe(takeUntil(this.killer$))
      .subscribe(value => this.totalElements = value);

    this.dtService.getItems(dtDefinition, page * size, size, this.selectedSortDirection,  this.selectedColumnName, text, filter)
      .pipe(takeUntil(this.killer$))
      .subscribe(data => this.apartments = data as Apartment[]);
  }

  filter() {
    this.loadApartmentPage(0, 10, this.searchInput.value);
  }

  pinApartment(): void {
    throw new Error("method not implemented");
  }
  
}

interface Filter {
  isRented?: boolean;
  leasesNumber?: number | null;
}
