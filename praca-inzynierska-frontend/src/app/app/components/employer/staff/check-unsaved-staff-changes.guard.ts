import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StaffComponent } from './staff.component';

@Injectable({
  providedIn: 'root'
})
export class CheckUnsavedStaffChangesGuard implements CanDeactivate<StaffComponent> {

  canDeactivate(component: StaffComponent): Observable<boolean> {
    return component.confirmUnsavedChanges()
  }
  
}
