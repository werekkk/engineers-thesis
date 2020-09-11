import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PositionsDto } from '../model/dto/PositionsDto';
import { PositionDto } from '../model/dto/PositionDto';
import { AccountDto } from '../model/dto/AccountDto';
import { environment } from '../../../environments/environment';
import { map, tap, mergeMap, switchMap } from 'rxjs/operators';
import { EmployeeService } from './employee.service'
import { SetPositionsDto } from '../model/dto/SetPositionsDto';
import { EmployeeDto } from '../model/dto/EmployeeDto';
import { Utils } from '../shared/utils/utils'

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  positionsLoaded = false
  positions: BehaviorSubject<PositionDto[]> = new BehaviorSubject([])

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService
  ) {}

  getAllPositions(): Observable<PositionDto[]> {
    return this.http.get(`${environment.serverUrl}/position/all`, {withCredentials: true})
    .pipe(
      map((response: PositionsDto) => {
        response.positions.sort(PositionDto.compare)
        this.positions.next(response.positions)
        this.positionsLoaded = true
        return response.positions
      })
    )
  }

  savePosition(newPosition: PositionDto, reloadEmployees: boolean = false): Observable<PositionDto> {
    return this.http.post(`${environment.serverUrl}/position`, newPosition, {withCredentials: true})
    .pipe(
      map((response: PositionDto) => {
        let currentPositions = this.positions.value
        if (response.id != newPosition.id) {
          currentPositions.push(response)
        } else {
          currentPositions = Utils.replaceArray(currentPositions, response, p => p.id == response.id)
        }
        currentPositions.sort(PositionDto.compare)
        this.positions.next(currentPositions)
        return response
      }),
      switchMap(p => {
        if (reloadEmployees) {
          return this.employeeService.getAllEmployees().pipe(map(() => p))
        } else {
          return of(p)
        }
      })
    )
  }

  deletePosition(positionId: number): Observable<PositionDto> {
    return this.http.delete(`${environment.serverUrl}/position/${positionId}`, {withCredentials: true})
    .pipe(
      map((response: PositionDto) => {
        let currentPositions = this.positions.value
        currentPositions = currentPositions.filter(p => p.id != response.id)
        this.employeeService.removePositionFromEmployees(positionId)
        this.positions.next(currentPositions)
        return response
      })
    )
  }

  setEmployeePositions(employee: EmployeeDto, positions: PositionDto[]): Observable<EmployeeDto> {
    let setPositionsRequest = new SetPositionsDto(
      employee.employeeId,
      positions.map(p => p.id)
    )
    return this.http.post(`${environment.serverUrl}/position/employee`, setPositionsRequest, {withCredentials: true})
    .pipe(
      map((response: EmployeeDto) => {
        let currentEmployees = this.employeeService.employees.value
        currentEmployees = Utils.replaceArray(currentEmployees, response, e => e.employeeId == response.employeeId)
        this.employeeService.employees.next(currentEmployees)
        return response
      })
    )
  }

}
