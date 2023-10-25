import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { EmptyLoginComponent } from './empty-login.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from 'src/app/modules/register/register.component';



@NgModule({
  declarations: [
    LoginComponent,
    EmptyLoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class EmptyLoginModule { }
