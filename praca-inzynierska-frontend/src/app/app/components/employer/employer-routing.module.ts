import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeesComponent } from './employees/employees.component';
import { EmployerComponent } from './employer/employer.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
import { StaffComponent } from './staff/staff.component';
import { SchedulePositionWeekEditComponent } from './schedule-position-week-edit/schedule-position-week-edit.component';

const routes: Routes = [
  {
    path: '', component: EmployerComponent, children: [
      {path: '', pathMatch: 'full', redirectTo: 'schedule'},
      {path: 'employees', component: EmployeesComponent},
      {path: 'schedule/position/:id/week', component: SchedulePositionWeekEditComponent},
      {path: 'schedule', component: ScheduleComponent},
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
