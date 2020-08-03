import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../user.service';
import { AuthenticationService } from '../authentication.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { empty, of } from 'rxjs';

/**
 * Logs out the user before activating the route.
 */
@Injectable({providedIn: 'root'})
export class RequireLoggedOutGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.loadUser().pipe(
      catchError(() => {
        return of(true)
      }),
      mergeMap(user => {
        return this.authenticationService.logout().pipe(
          catchError(() => {
            return of(true)
          }),
          map(() => true)          
        )
      })      
    )
  }
}