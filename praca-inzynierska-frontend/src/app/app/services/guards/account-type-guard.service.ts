import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

import { UserService } from '../user.service'
import { AuthenticationService } from '../authentication.service';
import { AccountDto } from '../../model/dto/AccountDto';
import { map } from 'rxjs/operators';


/**
 * Activates the route if the users account type matches required account type.
 * Otherwise redirects to `/unauthorized'
 * 
 * @param accountType Required user type.
 */
@Injectable({providedIn: 'root'})
export class AccountTypeGuard implements CanActivate {
  
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.loadUser().pipe(
      map( user => {
        if (this.isAccountTypeCorrect(route, user)) {
          return true
        } else {
          this.router.navigate(['./unauthorized'])
          return false
        }
      })
    )  
  }

  private isAccountTypeCorrect(route: ActivatedRouteSnapshot, user: AccountDto) {
    let wantedAccountType = route.data.accountType
    return user && (user.accountType === wantedAccountType)
  }
}