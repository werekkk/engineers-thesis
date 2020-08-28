import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesComponent } from './employees/employees.component';
import { EmployerComponent } from './employer/employer.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
import { StaffComponent } from './staff/staff.component';
import { SchedulePositionWeekEditComponent } from './schedule-position-week-edit/schedule-position-week-edit.component';
import { ScheduleGeneratorComponent } from './schedule-generator/schedule-generator.component';
import { ScheduleGeneratorResultComponent } from './schedule-generator-result/schedule-generator-result.component';

const routes: Routes = [
  {
    path: '', component: EmployerComponent, children: [
      {path: '', pathMatch: 'full', redirectTo: 'schedule'},
      {path: 'employees', component: EmployeesComponent},
      {path: 'schedule', component: ScheduleComponent},
      {path: 'schedule-generator', component: ScheduleGeneratorComponent},
      {path: 'schedule-generator-result', component: ScheduleGeneratorResultComponent},
      {path: 'working-hours', component: WorkingHoursComponent},
      {path: 'staff', component: StaffComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
