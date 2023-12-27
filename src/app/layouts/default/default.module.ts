import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApartmentListComponent } from 'src/app/modules/apartment-list/apartment-list.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';


@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent,
    ApartmentListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DefaultModule { }
