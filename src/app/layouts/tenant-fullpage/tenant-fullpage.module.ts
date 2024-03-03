import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TenantSettlementNotificationComponent } from 'src/app/modules/tenant-settlement-notification/tenant-settlement-notification.component';
import { PaySettlementPopupComponent } from 'src/app/modules/tenant/pay-settlement-popup/pay-settlement-popup.component';
import { ReplacePipe } from 'src/app/modules/tenant/tenant-profile/replace.pipe';
import { TenantProfileComponent } from 'src/app/modules/tenant/tenant-profile/tenant-profile.component';
import { TranslateSettlementStatusPipe } from 'src/app/modules/tenant/tenant-profile/translate-settlement-status.pipe';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TenantFullpageComponent } from './tenant-fullpage.component';



@NgModule({
  declarations: [
    TenantFullpageComponent,
    TenantProfileComponent,
    ReplacePipe,
    TenantSettlementNotificationComponent,
    TranslateSettlementStatusPipe,
    PaySettlementPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class TenantFullpageModule { }
