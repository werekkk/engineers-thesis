import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { PreferencesComponent } from './preferences/preferences.component';


const routes: Routes = [
  { path: '', component: EmployeeComponent, children: [
    { path: 'schedule', component: ScheduleComponent },
    { path: 'preferences', component: PreferencesComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
