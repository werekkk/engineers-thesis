import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PreferencesWeekComponent } from './preferences-week.component';

@Injectable({
  providedIn: 'root'
})
export class CheckUnsavedPreferencesChangesGuard implements CanDeactivate<PreferencesWeekComponent> {

  canDeactivate(component: PreferencesWeekComponent): Observable<boolean> {
    return component.confirmUnsavedChanges()
  }
  
}
