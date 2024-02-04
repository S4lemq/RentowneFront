import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartmentMeterEditContainerComponent } from './apartment-meter-edit-container/apartment-meter-edit-container.component';
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
import { SettingsComponent } from './modules/settings/settings.component';
import { TenantAddComponent } from './modules/tenant-add/tenant-add.component';
import { TenantEditComponent } from './modules/tenant-edit/tenant-edit.component';
import { TenantAuthorizeGuard } from './modules/tenant/common/tenant-authorizeGuard';
import { ProfileComponent } from './modules/tenant/profile/profile.component';
import { TenantLoginComponent } from './modules/tenant/tenant-login/tenant-login.component';
import { LostPasswordComponent } from './modules/lost-password/lost-password.component';
import { LostPasswordTenantComponent } from './modules/lost-password-tenant/lost-password-tenant.component';
import { TenantListComponent } from './modules/tenant-list/tenant-list.component';

const routes: Routes = [

   {
    path: '', component: DefaultComponent, canActivate: [AuthorizeGuard], children: [
      {path: 'settings', component: SettingsComponent, canActivate: [AuthorizeGuard]},
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments', component: ApartmentListComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments/edit/:id', component: ApartmentMeterEditContainerComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments/add', component: ApartmentAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'rented-object/:id/meters/add', component: MeterAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'meters/add', component: MeterAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'meters/edit/:id', component: MeterEditComponent, canActivate: [AuthorizeGuard]},
      {path: 'tenants/add', component: TenantAddComponent, canActivate: [AuthorizeGuard]},
      {path: 'tenants/edit/:id', component: TenantEditComponent, canActivate: [AuthorizeGuard]},
      {path: 'tenants', component: TenantListComponent, canActivate: [AuthorizeGuard]},
      
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
