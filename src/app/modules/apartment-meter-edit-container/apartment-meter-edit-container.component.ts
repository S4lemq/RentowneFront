import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-apartment-meter-edit-container',
  templateUrl: './apartment-meter-edit-container.component.html',
  styleUrls: ['./apartment-meter-edit-container.component.scss']
})
export class ApartmentMeterEditContainerComponent implements OnInit{

  apartmentId!: number;

  constructor(private acitvatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.apartmentId = Number(this.acitvatedRoute.snapshot.params['id']);
  }

}
