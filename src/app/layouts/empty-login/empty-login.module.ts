import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { RegisterComponent } from 'src/app/modules/register/register.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmptyLoginComponent } from './empty-login.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { LostPasswordComponent } from 'src/app/modules/lost-password/lost-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    EmptyLoginComponent,
    RegisterComponent,
    LostPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    NgOtpInputModule
  ]
})
export class EmptyLoginModule { }
