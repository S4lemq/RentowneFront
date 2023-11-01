import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultModule } from './layouts/default/default.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmptyLoginModule } from './layouts/empty-login/empty-login.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './modules/common/interceptor/jwt.interceptor';
import { AuthorizeGuard } from './modules/common/guard/authorizeGuard';
import { EmptyTenantLoginModule } from './layouts/empty-tenant-login/empty-tenant-login.module';
import { TenantFullpageModule } from './layouts/tenant-fullpage/tenant-fullpage.module';
import { TenantAuthorizeGuard } from './modules/tenant/common/tenant-authorizeGuard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DefaultModule,
    BrowserAnimationsModule,
    EmptyLoginModule,
    EmptyTenantLoginModule,
    TenantFullpageModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    AuthorizeGuard,
    TenantAuthorizeGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
