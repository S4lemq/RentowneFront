import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { ApartmentComponent } from './modules/apartment/apartment.component';
import { LoginComponent } from './modules/login/login.component';
import { EmptyLoginComponent } from './layouts/empty-login/empty-login.component';
import { AuthorizeGuard } from './modules/common/guard/authorizeGuard';
import { RegisterComponent } from './modules/register/register.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
