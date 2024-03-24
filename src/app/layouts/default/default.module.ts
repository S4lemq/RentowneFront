import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApartmentAddComponent } from 'src/app/modules/apartment-add/apartment-add.component';
import { ApartmentEditComponent } from 'src/app/modules/apartment-edit/apartment-edit.component';
import { ApartmentImageCropperComponent } from 'src/app/modules/apartment-image-cropper/apartment-image-cropper.component';
import { ApartmentListComponent } from 'src/app/modules/apartment-list/apartment-list.component';
import { ApartmentMeterEditContainerComponent } from 'src/app/modules/apartment-meter-edit-container/apartment-meter-edit-container.component';
import { BodyComponent } from 'src/app/modules/body/body.component';
import { CalculatePopupComponent } from 'src/app/modules/calculate-popup/calculate-popup.component';
import { ConfirmDialogComponent } from 'src/app/modules/confirm-dialog/confirm-dialog.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { HeaderComponent } from 'src/app/modules/header/header.component';
import { HousingProviderAddComponent } from 'src/app/modules/housing-provider-add/housing-provider-add.component';
import { TranslateBillingMethodPipe } from 'src/app/modules/housing-provider-add/pipe/translate-billing-method.pipe';
import { TranslateProviderTypePipe } from 'src/app/modules/housing-provider-add/pipe/translate-provider-type.pipe';
import { HousingProviderApartmentListComponent } from 'src/app/modules/housing-provider-apartment-list/housing-provider-apartment-list.component';
import { HousingProviderEditComponent } from 'src/app/modules/housing-provider-edit/housing-provider-edit.component';
import { HousingProviderListComponent } from 'src/app/modules/housing-provider-list/housing-provider-list.component';
import { HousingProviderSelectPopupComponent } from 'src/app/modules/housing-provider-select-popup/housing-provider-select-popup.component';
import { LeaseAgreementListComponent } from 'src/app/modules/lease-agreement-list/lease-agreement-list.component';
import { MeterAddComponent } from 'src/app/modules/meter-add/meter-add.component';
import { MeterCardViewComponent } from 'src/app/modules/meter-card-view/meter-card-view.component';
import { TranslateMeterTypePipe } from 'src/app/modules/meter-card-view/translate-meter-type.pipe';
import { MeterEditComponent } from 'src/app/modules/meter-edit/meter-edit.component';
import { MeterListComponent } from 'src/app/modules/meter-list/meter-list.component';
import { MeterReadingAddPopupComponent } from 'src/app/modules/meter-reading-add-popup/meter-reading-add-popup.component';
import { MeterReadingListComponent } from 'src/app/modules/meter-reading-list/meter-reading-list.component';
import { ImageCropperComponent } from 'src/app/modules/profile-edit/image-cropper/image-cropper.component';
import { ProfileEditComponent } from 'src/app/modules/profile-edit/profile-edit.component';
import { RentedObjectSettlementListComponent } from 'src/app/modules/rented-object-settlement-list/rented-object-settlement-list.component';
import { SettlementStatsComponent } from 'src/app/modules/settlement-stats/settlement-stats.component';
import { SidenavComponent } from 'src/app/modules/sidenav/sidenav.component';
import { SublevelMenuComponent } from 'src/app/modules/sidenav/sublevel-menu.component';
import { SingleRentedObjectSettlementExportPopupComponent } from 'src/app/modules/single-rented-object-settlement-export-popup/single-rented-object-settlement-export-popup.component';
import { SingleRentedObjectSettlementListComponent } from 'src/app/modules/single-rented-object-settlement-list/single-rented-object-settlement-list.component';
import { TenantAddComponent } from 'src/app/modules/tenant-add/tenant-add.component';
import { TenantBasicEditComponent } from 'src/app/modules/tenant-basic-edit/tenant-basic-edit.component';
import { TenantEditComponent } from 'src/app/modules/tenant-edit/tenant-edit.component';
import { TenantListComponent } from 'src/app/modules/tenant-list/tenant-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { DefaultComponent } from './default.component';
import { TranslateMeterUnitPipe } from 'src/app/modules/common/pipe/translate-meter-unit.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { CreditCardComponent } from 'src/app/modules/credit-card/credit-card.component';
import { TranslateLanguageType } from 'src/app/modules/profile-edit/translate-language-type.pipe';

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
    HousingProviderSelectPopupComponent,
    RentedObjectSettlementListComponent,
    SingleRentedObjectSettlementListComponent,
    CalculatePopupComponent,
    SingleRentedObjectSettlementExportPopupComponent,
    SettlementStatsComponent,
    LeaseAgreementListComponent,
    HousingProviderListComponent,
    MeterListComponent,
    ProfileEditComponent,
    ImageCropperComponent,
    ApartmentImageCropperComponent,
    TranslateMeterUnitPipe,
    TenantBasicEditComponent,
    CreditCardComponent,
    TranslateLanguageType
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    OverlayModule,
    CdkMenuModule,
    BreadcrumbModule,
    BrowserModule,
    FormsModule
  ]
})
export class DefaultModule { }
