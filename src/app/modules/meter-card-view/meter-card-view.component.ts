import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RentedObjectDto } from '../apartment-edit/model/rented-object-dto';
import { Subject, takeUntil } from 'rxjs';
import { MeterService } from '../meter-edit/meter.service';

@Component({
  selector: 'app-meter-card-view',
  templateUrl: './meter-card-view.component.html',
  styleUrls: ['./meter-card-view.component.scss']
})
export class MeterCardViewComponent implements OnInit, OnDestroy {

  rentedObjects!: Array<RentedObjectDto>;
  @Input() apartmentId!: number;
  private killer$ = new Subject<void>();

  constructor(private meterService: MeterService) {}

  ngOnInit(): void {
    this.meterService.getMeters(this.apartmentId)
    .pipe(takeUntil(this.killer$))
    .subscribe(data => this.rentedObjects = data);
  }

  ngOnDestroy(): void {
    this.killer$.next();
    this.killer$.complete();
  }


}
