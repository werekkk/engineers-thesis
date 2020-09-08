import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccountDto } from '../model/dto/AccountDto'
import { AccountType } from '../model/AccountType';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RegisterWorkplaceDetailsDto } from '../model/dto/RegisterWorkplaceDetailsDto';
import { RegisterEmployeeDetailsDto } from '../model/dto/RegisterEmployeeDetailsDto';
import { RegisterResponseDto } from '../model/dto/RegisterResponseDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: BehaviorSubject<AccountDto> = new BehaviorSubject(null)

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  
  /**
   * Fetches the current user data from server and saves it to the `user` attribute.
   * 
   * @returns An `Observable` containing the received user.
   */
  loadUser(): Observable<AccountDto> {
    return this.http.get(`${environment.serverUrl}/auth/user`, {withCredentials: true})
    .pipe(
      catchError((err: any, caught: Observable<any>) => {
        this.handleNewUser(null)
        return of(null)
      }),
      map((response: AccountDto) => {
      this.handleNewUser(response)
      return response
    }))
  }

  /**
   * Stores the provided `AccountDto` object as the currently logged in user.
   * 
   * @param newUser Object of type `AccountDto` representing currently logged in user.
   */
  handleNewUser(newUser: AccountDto) {
    if (newUser) {
      this.user.next(newUser)
    } else {
      this.user.next(null)
    }
  }

  /**
   * Redirects the application to the module corresponding with the `AccountType` of 
   * currently logged in user (e.g. `EmployerModule` for `AccountType.EMPLOYER`).
   */  
  redirectToModuleBasedOnUserType() {
    if (!this.user.value) {
      this.router.navigate(['./'])
    } else {
      switch(this.user.value.accountType) {
        case AccountType.EMPLOYER:
          this.router.navigate(['./employer'])
          break;
        case AccountType.EMPLOYEE:
          this.router.navigate(['./employee'])
          break;
      }
    }
  }

  /**
   * Clears the current logged in user data. Does not remove the JSESSIONID cookie.
   */
  removeUser() {
    this.user.next(null)
  }

  /**
   * 
   * @param registerDetails Register details of the employer and the workplace.
   */
  registerWorkplace(registerDetails: RegisterWorkplaceDetailsDto): Observable<RegisterResponseDto> {
    return this.http.post(
      `${environment.serverUrl}/user/register-workplace`, 
      registerDetails
    ) as Observable<RegisterResponseDto>
  }

  /**
   * Checks if the invitation token is valid and returns the invited employee
   * account details.
   * 
   * @param invitationToken Invitation token of the invited employee.
   * @returns An `Observable` containing the account information (first name, middle name, 
   * last name)
   */
  lookupInvitationToken(invitationToken: String): Observable<AccountDto> {
    return this.http.get(
      `${environment.serverUrl}/user/invitation/${invitationToken}`
    ) as Observable<AccountDto>
  }

  registerEmployee(registerDetails: RegisterEmployeeDetailsDto): Observable<AccountDto> {
    return this.http.post(
      `${environment.serverUrl}/user/register-employee`,
      registerDetails
    ) as Observable<AccountDto>
  }
}
