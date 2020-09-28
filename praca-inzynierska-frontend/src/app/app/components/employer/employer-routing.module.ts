import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesComponent } from './employees/employees.component';
import { EmployerComponent } from './employer/employer.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { StaffComponent } from './staff/staff.component';
import { ScheduleGeneratorComponent } from './schedule-generator/schedule-generator.component';
import { ScheduleGeneratorResultComponent } from './schedule-generator-result/schedule-generator-result.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AccountSettingsComponent } from '../shared/account-settings/account-settings.component';
import { CheckUnsavedStaffChangesGuard } from './staff/check-unsaved-staff-changes.guard'
import { CheckUnsavedGeneratedScheduleGuard } from './schedule-generator-result/check-unsaved-generated-schedule.guard'

const routes: Routes = [
  {
    path: '', component: EmployerComponent, children: [
      {path: '', pathMatch: 'full', redirectTo: 'schedule'},
      {path: 'employees', component: EmployeesComponent},
      {path: 'schedule', component: ScheduleComponent},
      {path: 'schedule/generator', component: ScheduleGeneratorComponent},
      {path: 'schedule-generator-result', component: ScheduleGeneratorResultComponent, canDeactivate: [CheckUnsavedGeneratedScheduleGuard]},
      {path: 'staff', component: StaffComponent, canDeactivate: [CheckUnsavedStaffChangesGuard]},
      {path: 'statistics', component: StatisticsComponent},
      {path: 'settings', component: AccountSettingsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
