import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee/employee.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeMenuComponent } from './employee-menu/employee-menu.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleEmployeeWeekComponent } from './schedule-employee-week/schedule-employee-week.component';
import { ScheduleEmployeeDayCellComponent } from './schedule-employee-day-cell/schedule-employee-day-cell.component';


@NgModule({
  declarations: [EmployeeComponent, EmployeeMenuComponent, ScheduleComponent, ScheduleEmployeeWeekComponent, ScheduleEmployeeDayCellComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule
  ]
})
export class EmployeeModule { }
