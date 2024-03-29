import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountTypeGuard } from './app/services/guards/account-type-guard.service'
import { IsLoggedInGuard } from './app/services/guards/is-logged-in-guard.service'
import { AccountType } from './app/model/AccountType';

const routes: Routes = [
  {
    path: '', 
    loadChildren: () => import('./app/components/main/main.module').then(m => m.MainModule)
  },
  {
    path: 'employer', 
    loadChildren: () => import('./app/components/employer/employer.module').then(m => m.EmployerModule),
    canActivate: [AccountTypeGuard],
    data: { accountType: AccountType.EMPLOYER }
  },
  {
    path: 'employee', 
    loadChildren: () => import('./app/components/employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [AccountTypeGuard],
    data: { accountType: AccountType.EMPLOYEE }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top', useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
