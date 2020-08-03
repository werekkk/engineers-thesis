import { Injectable } from '@angular/core';
import { _ParseAST } from '@angular/compiler';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserService } from './user.service';
import { Credentials } from '../model/Credentials';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountDto } from '../model/dto/AccountDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) { }

  /**
   * Logs in the user, saves the logged in user data in the `UserService` and redirects
   * to a module corresponding with the user `AccountType`.
   * 
   * @param credentials Contains username/email and password used for logging in. 
   */
  login(credentials: Credentials): Observable<AccountDto> {
    let headers = new HttpHeaders()
    headers = headers.append('Authorization', 'Basic ' + btoa(`${credentials.usernameOrEmail}:${credentials.password}`))
    return this.http.get(
      `${environment.serverUrl}/auth/authenticate`,
      {headers: headers, withCredentials: true})
      .pipe(
        map((response: AccountDto) => {
          this.userService.handleNewUser(response)
          this.userService.redirectToModuleBasedOnUserType()
          return response
        })
      )
  }

  /**
   * Invalidates the users JSESSIONID cookie with the server and clears the current user data.
   */
  logout(): Observable<void> {
    if (this.userService.user) {
      return this.http.get(
        `${environment.serverUrl}/auth/logout`,
        {withCredentials: true}
      ).pipe(
        map( () => {
          this.userService.removeUser()
        }, () => {
          this.userService.removeUser()
        })
      )
    }
    else return of(null)
  }

}
