import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from 'src/app/modules/tenant/profile/profile.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TenantFullpageComponent } from './tenant-fullpage.component';



@NgModule({
  declarations: [
    TenantFullpageComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class TenantFullpageModule { }
