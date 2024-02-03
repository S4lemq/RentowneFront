import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MeterReadingDto } from '../meter-reading-add-popup/model/meter-reading-dto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DTService } from 'src/app/shared/data-table/dt.service';
import { map, merge, startWith, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MeterReadingAddPopupComponent } from '../meter-reading-add-popup/meter-reading-add-popup.component';

@Component({
  selector: 'app-meter-reading-list',
  templateUrl: './meter-reading-list.component.html',
  styleUrls: ['./meter-reading-list.component.scss']
})
export class MeterReadingListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    "id", "currentReading", "readingDate", "consumption"
  ];
  totalElements: number = 0;
  meterReadings: MeterReadingDto[] = [];
  isLoadingResults: boolean = true;
  @Input() meterId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dtService: DTService,
    private dialog: MatDialog){}

  ngAfterViewInit(): void {
    this.loadMeterReadings();
  }

  loadMeterReadings() {
    const dtDefinition = 'METER_READING';
    const text = '';
    const filter = {
      "meterId": this.meterId
    };
  
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
            filter
          );
      }),
      map(data => {
        this.isLoadingResults = false;
        this.dtService.getItemsCount(dtDefinition, text, filter).subscribe(
          value => this.totalElements = value 
        );
        return data as MeterReadingDto[];
      })
    ).subscribe(data => this.meterReadings = data);
  }
  

  openPopup() {
    let _popup = this.dialog.open(MeterReadingAddPopupComponent,{
      width: '60%',
      data: {
        title: "Podaj odczyt licznika",
        meterId: this.meterId
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadMeterReadings();
    });
  }
}
