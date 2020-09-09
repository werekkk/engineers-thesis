import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PositionDto } from '../../../model/dto/PositionDto'
import { ShiftDto } from '../../../model/dto/ShiftDto'
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { StaffRequirementsService } from 'src/app/app/services/staff-requirements.service';
import { Utils } from 'src/app/app/shared/utils/utils';
import * as moment from 'moment';
import { GeneratorConfigDto } from 'src/app/app/model/dto/GeneratorConfigDto';

@Component({
  selector: 'schedule-generator-result-position',
  templateUrl: './schedule-generator-result-position.component.html',
  styleUrls: ['./schedule-generator-result-position.component.scss']
})
export class ScheduleGeneratorResultPositionComponent implements OnInit {

  _firstDay: Date
  get firstDay(): Date {
    return this._firstDay
  }
  @Input('firstDay')
  set firstDay(val: Date) {
    this._firstDay = val
    this.days = Utils.weekFrom(this.firstDay)
    if (this.shiftsTable) {
      this.initShiftsTable()
    }
  }
  
  days: Date[] = []

  @Input('position')
  position: PositionDto

  @Input('shifts')
  shifts: ShiftDto[]

  @Input('employees')
  employees: EmployeeDto[]

  @Input('config')
  config: GeneratorConfigDto

  employeesWithPosition: EmployeeDto[]

  requiredStaffLoaded: boolean = false
  requiredStaff: RequiredStaffDto = undefined

  shiftsTable: ShiftDto[][][] = undefined

  @Output('shiftsTableChange')
  shiftsTableChange: EventEmitter<ShiftDto[][][]> = new EventEmitter()

  constructor(
    private staffRequirementsService: StaffRequirementsService
  ) { }

  ngOnInit(): void {
    this.employeesWithPosition = this.employees.filter(e => e.positions.some(p => p.id == this.position.id))
    this.loadRequirements()
    this.initShiftsTable()
  }

  private loadRequirements() {
    this.requiredStaffLoaded = false
    this.staffRequirementsService.getPositionRequirements(this.position.id).subscribe(rs => {
      this.requiredStaff = rs
      this.requiredStaffLoaded = true
    })
  }

  private initShiftsTable() {
    this.initShiftsTableSize()

    let employeeMap = this.createEmployeeIdToIndexMap()
    let dayMap = this.createFirstDayDiffToIndexMap()

    this.shifts.forEach(s => {
      if (moment(s.start).isAfter(this.days[0]) && moment(s.start).subtract(1, 'day').isBefore(this.days[this.days.length-1])) {
        let empId = employeeMap.get(s.employeeId)
        let dayId = dayMap.get(Utils.daysDiff(this.days[0], s.start))
        this.shiftsTable[empId][dayId].push(s)
      }
    })

    this.shiftsTableChange.emit(this.shiftsTable)
  }

  private initShiftsTableSize() {
    let employeesCount = this.employeesWithPosition.length
    let daysCount = this.days.length
    let newShiftsTable: ShiftDto[][][] = []
    for (let i = 0; i < employeesCount; i++) {
      let days = []
      for (let j = 0; j < daysCount; j++) {
        days.push([])
      }      
      newShiftsTable.push(days)
    }
    this.shiftsTable = newShiftsTable
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
