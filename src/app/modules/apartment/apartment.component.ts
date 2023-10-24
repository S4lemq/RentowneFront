import { Component, OnInit } from '@angular/core';
import { ApartmentDto, ApartmentService } from './apartment.service';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss'],
})
export class ApartmentComponent implements OnInit {
  apartment: ApartmentDto | undefined;

  constructor(private apartmentService: ApartmentService) {}

  ngOnInit(): void {
    this.apartmentService.getAvailableApartmentNames().subscribe(data => {
      this.apartment = data;
    });
  }
}
