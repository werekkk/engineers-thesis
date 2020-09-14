import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { RegisterEmployerComponent } from './register-employer/register-employer.component';
import { MainComponent } from './main/main.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterSuccessComponent } from './register-success/register-success.component';


@NgModule({
  declarations: [
    HomeComponent,
    RegisterEmployeeComponent,
    RegisterEmployerComponent,
    MainComponent,
    UnauthorizedComponent,
    RegisterSuccessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainRoutingModule,
    SharedModule
  ]
})
export class MainModule { }
