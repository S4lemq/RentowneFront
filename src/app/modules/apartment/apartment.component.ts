import { Component, OnInit } from '@angular/core';
import { ApartmentDto, ApartmentService } from './apartment.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss'],
})
export class ApartmentComponent implements OnInit {
  apartment: ApartmentDto | undefined;

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor(private apartmentService: ApartmentService) {}

  ngOnInit(): void {
    this.apartmentService.getAvailableApartmentNames().subscribe(data => {
      this.apartment = data;
    });
  }
}
