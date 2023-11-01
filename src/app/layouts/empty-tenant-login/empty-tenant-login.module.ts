import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TenantLoginComponent } from 'src/app/modules/tenant/tenant-login/tenant-login.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { EmptyTenantLoginComponent } from './empty-tenant-login.component';



@NgModule({
  declarations: [
    TenantLoginComponent,
    EmptyTenantLoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EmptyTenantLoginModule { }
