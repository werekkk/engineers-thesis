import { Component, OnInit } from '@angular/core';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { Router } from '@angular/router';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { EmployeeService } from 'src/app/app/services/employee.service';
import { ShiftService } from '../../../services/shift.service'
import { Utils } from 'src/app/app/shared/Utils';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import * as moment from 'moment';
import { mergeAll, tap, map, flatMap } from 'rxjs/operators';
import { merge, Observable, of, noop } from 'rxjs';
import { EmployeesDto } from 'src/app/app/model/dto/EmployeesDto';

@Component({
  selector: 'schedule-position-week-edit',
  templateUrl: './schedule-position-week-edit.component.html',
  styleUrls: ['./schedule-position-week-edit.component.scss']
})
export class SchedulePositionWeekEditComponent implements OnInit {

  firstDay: Date

  days: Date[] = []

  position: PositionDto

  employeesLoaded = false
  shiftsLoaded = false
  employees: EmployeeDto[]
  employeesWithPosition: EmployeeDto[]

  shiftsTable: ShiftDto[][][] = []

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    public shiftService: ShiftService
  ) { 
    this.employeeService.employees.subscribe(newEmployees => {
      this.employees = newEmployees
    })
  }

  ngOnInit(): void {
    this.loadTableData()
    this.initDays()
    this.loadEmployees().pipe(
      tap(() => this.initShiftsTableSize()),
      flatMap(() => this.loadShifts()),
    ).subscribe()
  }

  private loadTableData() {
    let data: SchedulePostitionWeekData = history.state.data || this.shiftService.lastSchedulePositionWeekData
    if (!data) {
      this.router.navigate(['employer'])
      return
    } else {
      this.position = data.position
      this.firstDay = data.firstDay
      this.shiftService.lastSchedulePositionWeekData = data
    }
  }

  private loadEmployees(): Observable<any> {
    this.employeesLoaded = this.employeeService.employeesLoaded
    if (!this.employeesLoaded) {
      return this.employeeService.getAllEmployees()
      .pipe(
        tap((emps: EmployeesDto) => {
          this.employeesLoaded = true
          this.employees = emps.employees
          this.getEmployees()
        })
      )
    } else {
      return of(null).pipe(
        tap(() => {
          this.getEmployees()
        })
      )
    }
  }

  private getEmployees() {
    this.employeesWithPosition = this.employees.filter(e => e.positions.some(p => p.id == this.position.id))
  }

  private initShiftsTableSize() {
    let employeesCount = this.employeesWithPosition.length
    let daysCount = this.days.length
    let newShiftsTable = []
    for (let i = 0; i < employeesCount; i++) {
      let days = []
      for (let j = 0; j < daysCount; j++) {
        days.push([])
      }      
      newShiftsTable.push(days)
    }
    this.shiftsTable = newShiftsTable
  }

  private loadShifts(): Observable<any> {
    this.shiftsLoaded = false
    return this.shiftService.getShiftsInWeekByPositionId(this.position.id, this.firstDay)
    .pipe(
      tap(newShifts => {
        this.handleNewShifts(newShifts.shifts)
        this.shiftsLoaded = true
      })
    )
  }

  private initDays() {
    this.days = []
    for (let index = 0; index < 7; index++) {
      this.days.push(Utils.daysAfter(this.firstDay, index))
    }
  }

  private handleNewShifts(shifts: ShiftDto[]) {
    let employeeMap = this.createEmployeeIdToIndexMap()
    let dayMap = this.createFirstDayDiffToIndexMap()

    shifts.forEach(s => {
      let empId = employeeMap.get(s.employeeId)
      let dayId = dayMap.get(Utils.daysDiff(this.firstDay, s.start))
      this.shiftsTable[empId][dayId].push(s)
    })
  }

  private createEmployeeIdToIndexMap(): Map<number, number> {
    let map = new Map()
    this.employeesWithPosition.forEach((e, i) => {
      map.set(e.employeeId, i)
    });
    return map
  }

  private createFirstDayDiffToIndexMap(): Map<number, number> {
    let map = new Map()
    this.days.forEach((d, i) => {
      map.set(Utils.daysDiff(this.firstDay, d), i)
    })
    return map
  }
}



export type SchedulePostitionWeekData = {
  position: PositionDto,
  firstDay: Date
}