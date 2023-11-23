import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateAppModule } from '../modules/common/translate/translate.module';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    HttpClientModule,
    TranslateAppModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    MaterialModule,
    TranslateAppModule
  ]
})
export class SharedModule { }
