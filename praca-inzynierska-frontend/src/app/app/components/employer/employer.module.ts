import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerRoutingModule } from './employer-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EmployeesComponent } from './employees/employees.component';
import { EmployerComponent } from './employer/employer.component';
import { EmployerMenuComponent } from './employer-menu/employer-menu.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
import { EmployeesNewEmployeeModalComponent } from './employees-new-employee-modal/employees-new-employee-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { WorkingHoursEditorComponent } from './working-hours-editor/working-hours-editor.component';
import { WorkingHoursSliderComponent } from './working-hours-slider/working-hours-slider.component';
import { EmployeesEditEmployeePositionsModalComponent } from './employees-edit-employee-positions-modal/employees-edit-employee-positions-modal.component';
import { EmployeesEditGlobalPositionsModalComponent } from './employees-edit-global-positions-modal/employees-edit-global-positions-modal.component';
import { StaffRequirementsDayComponent } from './staff-requirements-day/staff-requirements-day.component';
import { StaffRequirementsPeriodListComponent } from './staff-requirements-period-list/staff-requirements-period-list.component';
import { StaffRequirementsDayEditorComponent } from './staff-requirements-day-editor/staff-requirements-day-editor.component';
import { StaffComponent } from './staff/staff.component';
import { StaffRequirementsComponent } from './staff-requirements/staff-requirements.component';
import { SchedulePositionWeekComponent } from './schedule-position-week/schedule-position-week.component';
import { SchedulePositionDayComponent } from './schedule-position-day/schedule-position-day.component';
import { SchedulePositionWeekEditComponent } from './schedule-position-week-edit/schedule-position-week-edit.component';
import { ScheduleEmployeeDayCellComponent } from './schedule-employee-day-cell/schedule-employee-day-cell.component';
import { SchedulePositionEditPopupComponent } from './schedule-position-edit-popup/schedule-position-edit-popup.component';
import { SchedulePositionDayLabelCellComponent } from './schedule-position-day-label-cell/schedule-position-day-label-cell.component';


@NgModule({
  declarations: [
    EmployeesComponent,
    EmployerComponent,
    EmployerMenuComponent,
    ScheduleComponent,
    WorkingHoursComponent,
    EmployeesNewEmployeeModalComponent,
    EmployeesListComponent,
    WorkingHoursEditorComponent,
    WorkingHoursSliderComponent,
    EmployeesEditEmployeePositionsModalComponent,
    EmployeesEditGlobalPositionsModalComponent,
    StaffRequirementsDayComponent,
    StaffRequirementsPeriodListComponent,
    StaffRequirementsDayEditorComponent,
    StaffComponent,
    StaffRequirementsComponent,
    SchedulePositionWeekComponent,
    SchedulePositionDayComponent,
    SchedulePositionWeekEditComponent,
    ScheduleEmployeeDayCellComponent,
    SchedulePositionEditPopupComponent,
    SchedulePositionDayLabelCellComponent
  ],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class EmployerModule { }
