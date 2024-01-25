import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { EmptyLoginComponent } from './layouts/empty-login/empty-login.component';
import { EmptyTenantLoginComponent } from './layouts/empty-tenant-login/empty-tenant-login.component';
import { TenantFullpageComponent } from './layouts/tenant-fullpage/tenant-fullpage.component';
import { ApartmentListComponent } from './modules/apartment-list/apartment-list.component';
import { AuthorizeGuard } from './modules/common/guard/authorizeGuard';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { TenantAuthorizeGuard } from './modules/tenant/common/tenant-authorizeGuard';
import { ProfileComponent } from './modules/tenant/profile/profile.component';
import { TenantLoginComponent } from './modules/tenant/tenant-login/tenant-login.component';
import { ApartmentEditComponent } from './modules/apartment-edit/apartment-edit.component';
import { ApartmentAddComponent } from './modules/apartment-add/apartment-add.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { MeterAddComponent } from './modules/meter-add/meter-add.component';
import { MeterEditComponent } from './modules/meter-edit/meter-edit.component';
import { LeaseAgreementAddComponent } from './modules/lease-agreement-add/lease-agreement-add.component';
import { LeaseAgreementEditComponent } from './modules/lease-agreement-edit/lease-agreement-edit.component';
import { TenantAddComponent } from './modules/tenant-add/tenant-add.component';
import { ApartmentMeterEditContainerComponent } from './apartment-meter-edit-container/apartment-meter-edit-container.component';
import { TenantEditComponent } from './modules/tenant-edit/tenant-edit.component';

const routes: Routes = [

   {
    path: '', component: DefaultComponent, children: [
      {path: 'settings', component: SettingsComponent, canActivate: [AuthorizeGuard]},
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments', component: ApartmentListComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments/edit/:id', component: ApartmentMeterEditContainerComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments/add', component: ApartmentAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'rented-object/:id/meters/add', component: MeterAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'meters/add', component: MeterAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'meters/edit/:id', component: MeterEditComponent, canActivate: [AuthorizeGuard]},
      {path: 'lease-agreements/add', component: LeaseAgreementAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'lease-agreements/edit/:id', component: LeaseAgreementEditComponent, canActivate: [AuthorizeGuard]},
      {path: 'tenants/add', component: TenantAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'tenants/edit/:id', component: TenantEditComponent, canActivate: [AuthorizeGuard]},
      
    ]
  },
  {
    path: '', component: EmptyLoginComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent}
    ]
  },
  {
    path: '', component: EmptyTenantLoginComponent, children: [
      {path: 'tenant/login', component: TenantLoginComponent},
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
