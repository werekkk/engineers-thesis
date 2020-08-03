import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { RegisterEmployerComponent } from './register-employer/register-employer.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { RequireLoggedOutGuard } from '../../services/guards/require-logged-out-guard.service'
import { IsLoggedInGuard } from '../../services/guards/is-logged-in-guard.service';

const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      {
        path: '', 
        component: HomeComponent,
        canActivate: [IsLoggedInGuard]
      },
      {
        path: 'register', 
        component: RegisterComponent,
        canActivate: [IsLoggedInGuard]
      },
      {
        path: 'invitation/:invitationToken', 
        component: RegisterEmployeeComponent, 
        canActivate: [RequireLoggedOutGuard]},
      {
        path: 'register-employer', 
        component: RegisterEmployerComponent,
        canActivate: [IsLoggedInGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
