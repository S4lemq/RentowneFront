import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApartmentListComponent } from 'src/app/modules/apartment-list/apartment-list.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';
import { ApartmentEditComponent } from 'src/app/modules/apartment-edit/apartment-edit.component';
import { ApartmentAddComponent } from 'src/app/modules/apartment-add/apartment-add.component';
import { ApartmentFormComponent } from 'src/app/modules/apartment-form/apartment-form.component';
import { ConfirmDialogComponent } from 'src/app/modules/confirm-dialog/confirm-dialog.component';
import { BodyComponent } from 'src/app/modules/body/body.component';
import { SidenavComponent } from 'src/app/modules/sidenav/sidenav.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { SettingsComponent } from 'src/app/modules/settings/settings.component';


@NgModule({
  declarations: [
    DefaultComponent,
    HomeComponent,
    ApartmentListComponent,
    ApartmentEditComponent,
    ApartmentAddComponent,
    ApartmentFormComponent,
    ConfirmDialogComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    BodyComponent
  ]
})
export class DefaultModule { }
