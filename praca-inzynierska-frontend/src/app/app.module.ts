import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MainModule } from './app/components/main/main.module';
import { EmployeeModule } from './app/components/employee/employee.module';
import { EmployerModule } from './app/components/employer/employer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { NoBasicAuthPopupInterceptor } from './app/interceptors/no-basic-auth-popup.interceptor';
import { ResponseUnauthorizedInterceptor } from './app/interceptors/response-unauthorized.interceptor';
import { SharedModule } from './app/components/shared/shared.module';
import localePl from '@angular/common/locales/pl'
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePl)

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseUnauthorizedInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
