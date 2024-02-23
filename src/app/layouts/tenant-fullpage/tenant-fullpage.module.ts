import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TenantFullpageComponent } from './tenant-fullpage.component';
import { TenantSettlementComponent } from 'src/app/modules/tenant/tenant-settlement/tenant-settlement.component';
import { TenantProfileComponent } from 'src/app/modules/tenant/tenant-profile/tenant-profile.component';
import { ReplacePipe } from 'src/app/modules/tenant/tenant-profile/replace.pipe';



@NgModule({
  declarations: [
    TenantFullpageComponent,
    TenantSettlementComponent,
    TenantProfileComponent,
    ReplacePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class TenantFullpageModule { }
