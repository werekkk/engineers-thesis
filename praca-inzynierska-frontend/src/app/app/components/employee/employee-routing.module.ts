import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { ScheduleComponent } from './schedule/schedule.component';


const routes: Routes = [
  { path: '', component: EmployeeComponent, children: [
    { path: 'schedule', component: ScheduleComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
