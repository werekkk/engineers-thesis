import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee/employee.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeMenuComponent } from './employee-menu/employee-menu.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleEmployeeWeekComponent } from './schedule-employee-week/schedule-employee-week.component';
import { ScheduleEmployeeDayCellComponent } from './schedule-employee-day-cell/schedule-employee-day-cell.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PreferencesWeekComponent } from './preferences-week/preferences-week.component';
import { PreferencesWeekEditorComponent } from './preferences-week-editor/preferences-week-editor.component';
import { PreferenceTypePickerComponent } from './preference-type-picker/preference-type-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PreferencesWeekTableComponent } from './preferences-week-table/preferences-week-table.component';
import { PreferencesWeekTableColumnComponent } from './preferences-week-table-column/preferences-week-table-column.component';


@NgModule({
  declarations: [
    EmployeeComponent, 
    EmployeeMenuComponent, 
    ScheduleComponent, 
    ScheduleEmployeeWeekComponent, 
    ScheduleEmployeeDayCellComponent, 
    PreferencesComponent, 
    PreferencesWeekComponent, 
    PreferencesWeekEditorComponent, 
    PreferenceTypePickerComponent, 
    PreferencesWeekTableComponent, 
    PreferencesWeekTableColumnComponent
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
