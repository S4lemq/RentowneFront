import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './modules/home/home.component';
import { ApartmentComponent } from './modules/apartment/apartment.component';

const routes: Routes = [
  {
    path: '', component: DefaultComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'apartments', component: ApartmentComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
