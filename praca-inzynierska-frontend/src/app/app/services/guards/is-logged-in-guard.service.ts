import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';

/**
 * If the user is logged in, redirects to a module corresponding with the 
 * curently logged in user type.
 */
@Injectable({providedIn: 'root'})
export class IsLoggedInGuard implements CanActivate {
  constructor(
    private userService: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.loadUser().pipe(
      map(user => {
        if (user) {
          this.userService.redirectToModuleBasedOnUserType()
          return false
        } else {
          return true
        }
      })
    )
  }
}