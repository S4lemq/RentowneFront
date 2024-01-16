import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultModule } from './layouts/default/default.module';
import { EmptyLoginModule } from './layouts/empty-login/empty-login.module';
import { EmptyTenantLoginModule } from './layouts/empty-tenant-login/empty-tenant-login.module';
import { TenantFullpageModule } from './layouts/tenant-fullpage/tenant-fullpage.module';
import { AuthorizeGuard } from './modules/common/guard/authorizeGuard';
import { ErrorHandlingInterceptor } from './modules/common/interceptor/error-handling.interceptor';
import { JwtInterceptor } from './modules/common/interceptor/jwt.interceptor';
import { TranslateAppModule } from './modules/common/translate/translate.module';
import { TenantAuthorizeGuard } from './modules/tenant/common/tenant-authorizeGuard';
import { SidenavComponent } from './modules/sidenav/sidenav.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SettingsComponent } from './modules/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DefaultModule,
    BrowserAnimationsModule,
    EmptyLoginModule,
    EmptyTenantLoginModule,
    TenantFullpageModule,
    MatSnackBarModule,
    TranslateAppModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
    AuthorizeGuard,
    TenantAuthorizeGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translate: TranslateService) {
    this.initializeTranslation();
  }

  initializeTranslation(): void {
    this.translate.setDefaultLang('pl');
    this.translate.use('pl');
  }
}

// Factory function for HttpLoader
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

