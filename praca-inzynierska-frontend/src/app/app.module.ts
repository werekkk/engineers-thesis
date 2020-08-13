import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MainModule } from './app/components/main/main.module';
import { EmployeeModule } from './app/components/employee/employee.module';
import { EmployerModule } from './app/components/employer/employer.module';
import { AppComponent } from './app.component';
import { NoBasicAuthPopupInterceptor } from './app/interceptors/no-basic-auth-popup.interceptor';
import { UnauthorizedComponent } from './app/components/shared/unauthorized/unauthorized.component';
import { SharedModule } from './app/components/shared/shared.module';
import localePl from '@angular/common/locales/pl'
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePl)

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MainModule,
    EmployerModule,
    EmployeeModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoBasicAuthPopupInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
