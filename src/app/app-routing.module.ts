import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { EmptyLoginComponent } from './layouts/empty-login/empty-login.component';
import { EmptyTenantLoginComponent } from './layouts/empty-tenant-login/empty-tenant-login.component';
import { TenantFullpageComponent } from './layouts/tenant-fullpage/tenant-fullpage.component';
import { ApartmentListComponent } from './modules/apartment-list/apartment-list.component';
import { AuthorizeGuard } from './modules/common/guard/authorizeGuard';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { TenantAuthorizeGuard } from './modules/tenant/common/tenant-authorizeGuard';
import { ProfileComponent } from './modules/tenant/profile/profile.component';
import { TenantLoginComponent } from './modules/tenant/tenant-login/tenant-login.component';
import { ApartmentEditComponent } from './modules/apartment-edit/apartment-edit.component';
import { ApartmentAddComponent } from './modules/apartment-add/apartment-add.component';

const routes: Routes = [
  {
    path: '', component: DefaultComponent, children: [
      {path: '', component: HomeComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments', component: ApartmentListComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments/edit/:id', component: ApartmentEditComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments/add', component: ApartmentAddComponent, canActivate: [AuthorizeGuard]},
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
