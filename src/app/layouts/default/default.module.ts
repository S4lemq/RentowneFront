import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApartmentMeterEditContainerComponent } from 'src/app/modules/apartment-meter-edit-container/apartment-meter-edit-container.component';
import { ApartmentAddComponent } from 'src/app/modules/apartment-add/apartment-add.component';
import { ApartmentEditComponent } from 'src/app/modules/apartment-edit/apartment-edit.component';
import { ApartmentListComponent } from 'src/app/modules/apartment-list/apartment-list.component';
import { BodyComponent } from 'src/app/modules/body/body.component';
import { ConfirmDialogComponent } from 'src/app/modules/confirm-dialog/confirm-dialog.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { HeaderComponent } from 'src/app/modules/header/header.component';
import { MeterAddComponent } from 'src/app/modules/meter-add/meter-add.component';
import { MeterCardViewComponent } from 'src/app/modules/meter-card-view/meter-card-view.component';
import { TranslateMeterTypePipe } from 'src/app/modules/meter-card-view/translate-meter-type.pipe';
import { MeterEditComponent } from 'src/app/modules/meter-edit/meter-edit.component';
import { SettingsComponent } from 'src/app/modules/settings/settings.component';
import { SidenavComponent } from 'src/app/modules/sidenav/sidenav.component';
import { SublevelMenuComponent } from 'src/app/modules/sidenav/sublevel-menu.component';
import { TenantAddComponent } from 'src/app/modules/tenant-add/tenant-add.component';
import { TenantEditComponent } from 'src/app/modules/tenant-edit/tenant-edit.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';
import { MeterReadingListComponent } from 'src/app/modules/meter-reading-list/meter-reading-list.component';
import { MeterReadingAddPopupComponent } from 'src/app/modules/meter-reading-add-popup/meter-reading-add-popup.component';
import { TenantListComponent } from 'src/app/modules/tenant-list/tenant-list.component';
import { HousingProviderAddComponent } from 'src/app/modules/housing-provider-add/housing-provider-add.component';
import { TranslateProviderTypePipe } from 'src/app/modules/housing-provider-add/pipe/translate-provider-type.pipe';
import { TranslateBillingMethodPipe } from 'src/app/modules/housing-provider-add/pipe/translate-billing-method.pipe';
import { HousingProviderEditComponent } from 'src/app/modules/housing-provider-edit/housing-provider-edit.component';
import { HousingProviderApartmentListComponent } from 'src/app/modules/housing-provider-apartment-list/housing-provider-apartment-list.component';
import { HousingProviderSelectPopupComponent } from 'src/app/modules/housing-provider-select-popup/housing-provider-select-popup.component';


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
    TenantAddComponent,
    ApartmentMeterEditContainerComponent,
    TenantEditComponent,
    MeterReadingListComponent,
    MeterReadingAddPopupComponent,
    TenantListComponent,
    HousingProviderAddComponent,
    TranslateProviderTypePipe,
    TranslateBillingMethodPipe,
    HousingProviderEditComponent,
    HousingProviderApartmentListComponent,
    HousingProviderSelectPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    OverlayModule,
    CdkMenuModule
  ]
})
export class DefaultModule { }
