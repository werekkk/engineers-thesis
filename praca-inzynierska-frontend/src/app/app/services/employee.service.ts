import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { EmployeeDto } from '../model/dto/EmployeeDto';
import { EmployeesDto } from '../model/dto/EmployeesDto';
import { AddEmployeeDto } from '../model/dto/AddEmployeeDto';
import { AccountDto } from '../model/dto/AccountDto';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Utils } from '../shared/utils/utils';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { SetPositionsDto } from '../model/dto/SetPositionsDto';
import { PositionDto } from '../model/dto/PositionDto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employeesLoaded = false

  employer: BehaviorSubject<AccountDto> = new BehaviorSubject(null)
  employees: BehaviorSubject<EmployeeDto[]> = new BehaviorSubject([])

  constructor(
    private http: HttpClient
  ) { }

  addEmployee(employeeDetails: AddEmployeeDto): Observable<EmployeeDto> {
    return this.http.post(
      `${environment.serverUrl}/employee/add`, 
      employeeDetails,
      {withCredentials: true}
      ).pipe(
        map((newEmployee: EmployeeDto) => {
          let newEmployees = this.employees.value
          newEmployees.push(newEmployee)
          newEmployees.sort(EmployeeDto.compare)
          newEmployees.forEach(e => e.positions.sort(PositionDto.compare))
          this.employees.next(newEmployees)
          return newEmployee
        })
      )
  }

  getAllEmployees(): Observable<EmployeesDto> {
    return this.http.get(
      `${environment.serverUrl}/employee/getAll`,
      {withCredentials: true}
    ).pipe(
      map((response: EmployeesDto) => {
        response.employees.sort(EmployeeDto.compare)
        response.employees.forEach(e => e.positions.sort(PositionDto.compare))
        this.employer.next(response.employer)
        this.employees.next(response.employees)
        this.employeesLoaded = true
        return response
      })
    )
  }

  deleteEmployee(employeeId: number): Observable<number> {
    return this.http.delete(
      `${environment.serverUrl}/employee/delete/${employeeId}`,
      {withCredentials: true}
    ).pipe(
      map((deletedId: number) => {
        let employees = this.employees.value.filter(e => e.employeeId != deletedId)
        this.employees.next(employees)
        return deletedId
      })
    )
  }

  removePositionFromEmployees(positionId: number) {
    let employees = this.employees.value
    for (let index = 0; index < employees.length; index++) {
      const element = employees[index];
      element.positions = element.positions.filter(p => p.id != positionId)
    }
    this.employees.next(employees)
  }

  static generateInvitationLink(invitationToken: string): string {
    return `${window.location.origin}${environment.baseHref}/#/invitation/${invitationToken}`
  }
}
