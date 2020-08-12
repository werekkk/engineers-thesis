import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { PreferencesComponent } from './preferences/preferences/preferences.component';


const routes: Routes = [
  {
    path: '', component: EmployeeComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'schedule' },
      { path: 'schedule', component: ScheduleComponent },
      {
        path: 'preferences',
        loadChildren: () => import('./preferences/preferences.module').then(m => m.PreferencesModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
