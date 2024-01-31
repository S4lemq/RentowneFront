import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TenantLoginComponent } from 'src/app/modules/tenant/tenant-login/tenant-login.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmptyTenantLoginComponent } from './empty-tenant-login.component';
import { LostPasswordTenantComponent } from 'src/app/modules/lost-password-tenant/lost-password-tenant.component';



@NgModule({
  declarations: [
    TenantLoginComponent,
    EmptyTenantLoginComponent,
    LostPasswordTenantComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class EmptyTenantLoginModule { }
