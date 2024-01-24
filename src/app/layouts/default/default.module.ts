import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApartmentListComponent } from 'src/app/modules/apartment-list/apartment-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';
import { ApartmentEditComponent } from 'src/app/modules/apartment-edit/apartment-edit.component';
import { ApartmentAddComponent } from 'src/app/modules/apartment-add/apartment-add.component';
import { ConfirmDialogComponent } from 'src/app/modules/confirm-dialog/confirm-dialog.component';
import { BodyComponent } from 'src/app/modules/body/body.component';
import { SidenavComponent } from 'src/app/modules/sidenav/sidenav.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { SettingsComponent } from 'src/app/modules/settings/settings.component';
import { SublevelMenuComponent } from 'src/app/modules/sidenav/sublevel-menu.component';
import { HeaderComponent } from 'src/app/modules/header/header.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MeterEditComponent } from 'src/app/modules/meter-edit/meter-edit.component';
import { TranslateMeterTypePipe } from 'src/app/modules/meter-card-view/translate-meter-type.pipe';
import { MeterCardViewComponent } from 'src/app/modules/meter-card-view/meter-card-view.component';
import { MeterAddComponent } from 'src/app/modules/meter-add/meter-add.component';
import { LeaseAgreementAddComponent } from 'src/app/modules/lease-agreement-add/lease-agreement-add.component';
import { LeaseAgreementEditComponent } from 'src/app/modules/lease-agreement-edit/lease-agreement-edit.component';


@NgModule({
  declarations: [
    DefaultComponent,
    ApartmentListComponent,
    ApartmentEditComponent,
    ApartmentAddComponent,
    ConfirmDialogComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    SettingsComponent,
    SublevelMenuComponent,
    HeaderComponent,
    MeterEditComponent,
    TranslateMeterTypePipe,
    MeterCardViewComponent,
    MeterAddComponent,
    LeaseAgreementAddComponent,
    LeaseAgreementEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    OverlayModule,
    CdkMenuModule
  ],
  exports: [
    BodyComponent
  ]
})
export class DefaultModule { }
