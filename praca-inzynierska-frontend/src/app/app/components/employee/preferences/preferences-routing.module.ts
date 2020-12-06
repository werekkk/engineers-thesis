import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PreferencesComponent } from './preferences/preferences.component';
import { PreferencesWeekComponent } from './preferences-week/preferences-week.component';
import { PreferencesOneTimeComponent } from './preferences-one-time/preferences-one-time.component';
import { CheckUnsavedPreferencesChangesGuard } from './preferences-week/check-unsaved-preferences-changes.guard'

const routes: Routes = [
    {
        path: '',
        component: PreferencesComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'week' },
            { path: 'week', component: PreferencesWeekComponent, canDeactivate: [CheckUnsavedPreferencesChangesGuard] },
            { path: 'one-time', component: PreferencesOneTimeComponent },
        ]
    }
];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PreferencesRoutingModule { }
  