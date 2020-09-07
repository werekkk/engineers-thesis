import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee/employee.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeMenuComponent } from './employee-menu/employee-menu.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleEmployeeWeekComponent } from './schedule-employee-week/schedule-employee-week.component';
import { ScheduleEmployeeDayCellComponent } from './schedule-employee-day-cell/schedule-employee-day-cell.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ScheduleCalendarComponent } from './schedule-calendar/schedule-calendar.component';
import { ScheduleCalendarCellComponent } from './schedule-calendar-cell/schedule-calendar-cell.component';

@NgModule({
  declarations: [
    EmployeeComponent, 
    EmployeeMenuComponent, 
    ScheduleComponent, 
    ScheduleEmployeeWeekComponent, 
    ScheduleEmployeeDayCellComponent, ScheduleCalendarComponent, ScheduleCalendarCellComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule,
    FormsModule,
    NgbModule
  ]
})
export class EmployeeModule { }
