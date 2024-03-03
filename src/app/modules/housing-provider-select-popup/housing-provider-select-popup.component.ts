import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, map, merge, startWith, switchMap, takeUntil } from 'rxjs';
import { HousingProviderDto } from '../housing-provider-add/model/housing-provider-dto';
import { MatPaginator } from '@angular/material/paginator';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { HousingProviderService } from '../housing-provider-add/housing-provider.service';
import { ApartmentHousingProviderRequest } from '../housing-provider-add/model/apartment-housing-provider-request';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateProviderTypePipe } from '../housing-provider-add/pipe/translate-provider-type.pipe';

@Component({
  selector: 'app-housing-provider-select-popup',
  templateUrl: './housing-provider-select-popup.component.html',
  styleUrls: ['./housing-provider-select-popup.component.scss']
})
export class HousingProviderSelectPopupComponent implements OnInit, AfterViewInit, OnDestroy {
  private killer$ = new Subject<void>();
  displayedColumns: string[] = [
    "select", "name", "type", "tax"
  ];
  totalElements: number = 0;
  housingProviders: HousingProviderDto[] = [];
  inputData: any;
  selectedHousingProviders!: number[];
  selection = new SelectionModel<HousingProviderDto>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dtService: DTService,
    private ref: MatDialogRef<HousingProviderSelectPopupComponent>,
    private housingProviderService: HousingProviderService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.inputData = this.data;
    if (Array.isArray(this.data.selectedHousingProviders)) {
      this.selectedHousingProviders = this.data.selectedHousingProviders;
    } else {
      this.selectedHousingProviders = [];
    }
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  closePopup() {
    this.ref.close();
  }

  loadData() {
    const dtDefinition = 'APARTMENT_HOUSING_PROVIDER';
    const text = '';
    const filter = {};
  
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
    .subscribe(data => {
      this.housingProviders = data;
      this.preselectProviders();
    });
  }

  preselectProviders() {
    // Upewniamy się, że housingProviders zostały już załadowane.
    if (this.housingProviders && this.selectedHousingProviders) {
      this.housingProviders.forEach(provider => {
        if (provider.id !== undefined && this.selectedHousingProviders.includes(provider.id)) {
          this.selection.select(provider);
        }
      });
    }
  }
  

  getSelectedIds(): number[] {
    return this.selection.selected
      .filter(provider => provider.id !== undefined)
      .map(provider => provider.id!);
  }

  save() {
    const dto: ApartmentHousingProviderRequest = {
      apartmentId: this.data.apartmentId,
      housingProviderIds: this.getSelectedIds()
    }

    this.housingProviderService.addHousingProviderToApartment(dto)
    .pipe(takeUntil(this.killer$))
    .subscribe({
      next: () => {
        () => this.closePopup();
      },
      error: err => {
        if (err.error.code === 'PROVIDER_TYPE_ALREADY_EXISTS') {
          const translateProviderTypePipe = new TranslateProviderTypePipe();
          const providerType = translateProviderTypePipe.transform(err.error.field);
          this.translateService.get("snackbar.providerTypeAlreadyExists", { type: providerType })
          .subscribe(translatedText => {
            this.snackBar.open(translatedText, '', {
              duration: 3000,
              panelClass: ['snackbarError']
            });
          });
        }
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.housingProviders.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.housingProviders.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: HousingProviderDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

}
