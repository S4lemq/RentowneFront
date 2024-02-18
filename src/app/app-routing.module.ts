import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartmentMeterEditContainerComponent } from './modules/apartment-meter-edit-container/apartment-meter-edit-container.component';
import { DefaultComponent } from './layouts/default/default.component';
import { EmptyLoginComponent } from './layouts/empty-login/empty-login.component';
import { EmptyTenantLoginComponent } from './layouts/empty-tenant-login/empty-tenant-login.component';
import { TenantFullpageComponent } from './layouts/tenant-fullpage/tenant-fullpage.component';
import { ApartmentAddComponent } from './modules/apartment-add/apartment-add.component';
import { ApartmentListComponent } from './modules/apartment-list/apartment-list.component';
import { AuthorizeGuard } from './modules/common/guard/authorizeGuard';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/login.component';
import { MeterAddComponent } from './modules/meter-add/meter-add.component';
import { MeterEditComponent } from './modules/meter-edit/meter-edit.component';
import { RegisterComponent } from './modules/register/register.component';
import { TenantAddComponent } from './modules/tenant-add/tenant-add.component';
import { TenantEditComponent } from './modules/tenant-edit/tenant-edit.component';
import { TenantAuthorizeGuard } from './modules/tenant/common/tenant-authorizeGuard';
import { ProfileComponent } from './modules/tenant/profile/profile.component';
import { TenantLoginComponent } from './modules/tenant/tenant-login/tenant-login.component';
import { LostPasswordComponent } from './modules/lost-password/lost-password.component';
import { LostPasswordTenantComponent } from './modules/lost-password-tenant/lost-password-tenant.component';
import { TenantListComponent } from './modules/tenant-list/tenant-list.component';
import { HousingProviderAddComponent } from './modules/housing-provider-add/housing-provider-add.component';
import { HousingProviderEditComponent } from './modules/housing-provider-edit/housing-provider-edit.component';
import { RentedObjectSettlementListComponent } from './modules/rented-object-settlement-list/rented-object-settlement-list.component';
import { SingleRentedObjectSettlementListComponent } from './modules/single-rented-object-settlement-list/single-rented-object-settlement-list.component';
import { SettlementStatsComponent } from './modules/settlement-stats/settlement-stats.component';
import { LeaseAgreementListComponent } from './modules/lease-agreement-list/lease-agreement-list.component';
import { HousingProviderListComponent } from './modules/housing-provider-list/housing-provider-list.component';
import { MeterListComponent } from './modules/meter-list/meter-list.component';
import { DeactivateGurad } from './modules/common/guard/deactivateGuard';
import { ApartmentEditComponent } from './modules/apartment-edit/apartment-edit.component';

const routes: Routes = [
   {
    path: '', component: DefaultComponent, canActivate: [AuthorizeGuard], children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthorizeGuard],
        data: { breadcrumb: 'Rentowne > Pulpit' }
      },
      {
        path: 'apartments', 
        component: ApartmentListComponent, 
        canActivate: [AuthorizeGuard], 
        data: { breadcrumb: 'Rentowne > Lista nieruchomości'}
      },
      {
        path: 'apartments/edit/:id', 
        component: ApartmentEditComponent, 
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad],
        data: { breadcrumb: 'Rentowne > Lista nieruchomości > Edycja' }
      },
      {
        path: 'apartments/add',
        component: ApartmentAddComponent,
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad],
        data: { breadcrumb: 'Rentowne > Lista nieruchomości > Dodaj nieruchomość' }
      },
      {
        path: 'rented-object/:id/meters/add', 
        component: MeterAddComponent, 
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad],
        data: { breadcrumb: 'Rentowne > Lista nieruchomości > Edycja > Dodaj licznik' }
      },
      {
        path: 'meters/add', 
        component: MeterAddComponent, 
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad], 
        data: { breadcrumb: 'Rentowne > Lista liczników > Dodaj licznik' }
      },
      {
        path: 'meters/edit/:id', 
        component: MeterEditComponent, 
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad],  
        data: { breadcrumb: 'Rentowne > Lista liczników > Edycja' }
      },
      {
        path: 'agreements/add',
        component: TenantAddComponent, 
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad],
        data: { breadcrumb: 'Rentowne > Lista umów > Dodaj umowę' }
      },
      {
        path: 'agreements/edit/:id', 
        component: TenantEditComponent, 
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad],
        data: { breadcrumb: 'Rentowne > Lista umów > Edycja' }
      },
      {
        path: 'tenants', 
        component: TenantListComponent, 
        canActivate: [AuthorizeGuard], 
        data: { breadcrumb: 'Rentowne > Lista najemców' }
      },
      {
        path: 'housing-providers/add', 
        component: HousingProviderAddComponent, 
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad],
        data: { breadcrumb: 'Rentowne > Lista dostawców > Dodaj dostawcę' }
      },
      {
        path: 'housing-providers/edit/:id', 
        component: HousingProviderEditComponent, 
        canActivate: [AuthorizeGuard],
        canDeactivate: [DeactivateGurad],
        data: { breadcrumb: 'Rentowne > Lista dostawców > Edycja' }
      },
      {
        path: 'finances',
        component: RentedObjectSettlementListComponent, 
        canActivate: [AuthorizeGuard], 
        data: { breadcrumb: 'Rentowne > Finanse' }
      },
      {
        path: 'rented-object-finances/:id', 
        component: SingleRentedObjectSettlementListComponent, 
        canActivate: [AuthorizeGuard],
        data: { breadcrumb: 'Rentowne > Finanse > Rozliczenia' }
      },
      {
        path: 'analytics', 
        component: SettlementStatsComponent, 
        canActivate: [AuthorizeGuard], 
        data: { breadcrumb: 'Rentowne > Analizy' }
      },
      {
        path: 'agreements', 
        component: LeaseAgreementListComponent, 
        canActivate: [AuthorizeGuard], 
        data: { breadcrumb: 'Rentowne > Lista umów' }
      },
      {
        path: 'housing-providers', 
        component: HousingProviderListComponent, 
        canActivate: [AuthorizeGuard], 
        data: { breadcrumb: 'Rentowne > Lista dostawców' }
      },
      {
        path: 'meters', 
        component: MeterListComponent, 
        canActivate: [AuthorizeGuard], 
        data: { breadcrumb: 'Rentowne > Lista liczników' }
      },
    ]
  },
  {
    path: '', component: EmptyLoginComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'lost-password', component: LostPasswordComponent},
      {path: 'lost-password/:hash', component: LostPasswordComponent}
    ]
  },
  {
    path: '', component: EmptyTenantLoginComponent, children: [
      {path: 'tenant/login', component: TenantLoginComponent},
      {path: 'tenant-lost-password', component: LostPasswordTenantComponent},
      {path: 'tenant-lost-password/:hash', component: LostPasswordTenantComponent},
      {path: 'tenant-password/:hash', component: LostPasswordTenantComponent}
    ]
  },
  {
    path: '', component: TenantFullpageComponent, children: [
      {path: 'tenant/profile', component: ProfileComponent, canActivate: [TenantAuthorizeGuard]},
    ]
  } 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
