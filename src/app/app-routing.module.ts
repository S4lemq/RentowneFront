import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { ApartmentComponent } from './modules/apartment/apartment.component';
import { LoginComponent } from './modules/login/login.component';
import { EmptyLoginComponent } from './layouts/empty-login/empty-login.component';
import { AuthorizeGuard } from './modules/common/guard/authorizeGuard';
import { RegisterComponent } from './modules/register/register.component';
import { EmptyTenantLoginComponent } from './layouts/empty-tenant-login/empty-tenant-login.component';
import { TenantLoginComponent } from './modules/tenant/tenant-login/tenant-login.component';
import { TenantFullpageComponent } from './layouts/tenant-fullpage/tenant-fullpage.component';
import { ProfileComponent } from './modules/tenant/profile/profile.component';

const routes: Routes = [
  {
    path: '', component: DefaultComponent, children: [
      {path: '', component: HomeComponent, canActivate: [AuthorizeGuard]},
      {path: 'apartments', component: ApartmentComponent, canActivate: [AuthorizeGuard]},
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
      {path: 'tenant/profile', component: ProfileComponent, canActivate: [AuthorizeGuard]},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
