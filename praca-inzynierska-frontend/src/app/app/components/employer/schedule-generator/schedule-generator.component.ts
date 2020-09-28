import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PositionService } from 'src/app/app/services/position.service';
import { EmployeeService } from 'src/app/app/services/employee.service';
import { Utils } from 'src/app/app/shared/utils/utils';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { Router } from '@angular/router';
import { GeneratorState } from '../schedule-generator-result/schedule-generator-result.component';
import { GeneratorConfigDto } from 'src/app/app/model/dto/GeneratorConfigDto';
import { StateService } from 'src/app/app/services/state.service';

@Component({
  selector: 'schedule-generator',
  templateUrl: './schedule-generator.component.html',
  styleUrls: ['./schedule-generator.component.scss']
})
export class ScheduleGeneratorComponent implements OnInit {

  startDate: Date = moment().startOf('day').toDate()
  finishDate: Date = moment().startOf('day').toDate()

  positionsLoaded: boolean = false
  employeesLoaded: boolean = false

  positionChecked: boolean[] = []
  employeeChecked: boolean[] = []
  employeeEnabled: boolean[] = []

  durationInDays: number

  highlightedPosition: PositionDto = null

  constructor(
    public positionService: PositionService,
    public employeeService: EmployeeService,
    private stateService: StateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getStartingAndEndingDates()
    this.onDurationChange()
    this.positionsLoaded = this.positionService.positionsLoaded
    this.employeesLoaded = this.employeeService.employeesLoaded
    if (!this.positionsLoaded) {
      this.positionService.getAllPositions().subscribe(() => {
      this.positionsLoaded = true
      this.initCheckboxArrays()
      })
    }
    if (!this.employeesLoaded) {
      this.employeeService.getAllEmployees().subscribe(() => {
        this.employeesLoaded = true
        this.initCheckboxArrays()
      })
    }
    this.initCheckboxArrays()
  }

  getStartingAndEndingDates() {
    this.startDate = moment(this.stateService.startingDate).startOf('day').toDate()
    this.finishDate = moment(this.stateService.startingDate).startOf('day').add(6, 'days').toDate()
    this.stateService.startingDate = new Date()
  }

  onDurationChange(source: 'start' | 'finish' = 'finish') {
    if (moment(this.finishDate).isBefore(this.startDate)) {
      if (source == 'start') {
        this.finishDate = this.startDate
      } else if (source == 'finish') {
        this.startDate = this.finishDate
      }
    }
    this.durationInDays = moment(this.finishDate).add(1, 'day').diff(this.startDate, 'day')
  }

  initCheckboxArrays() {
    if (this.positionService.positionsLoaded && this.employeeService.employeesLoaded) {
      this.positionChecked = Utils.emptyBooleanArray(this.positionService.positions.value.length)
      this.employeeChecked = Utils.emptyBooleanArray(this.employeeService.employees.value.length)
      this.employeeEnabled = Utils.emptyBooleanArray(this.employeeService.employees.value.length)
    }
  }

  onGenerateClicked() {
    let positions: PositionDto[] = []
    let employees: EmployeeDto[] = []
    this.positionChecked.forEach((val, i) => {if (val) positions.push(this.positionService.positions.value[i])})
    this.employeeChecked.forEach((val, i) => {if (val && this.employeeEnabled[i]) employees.push(this.employeeService.employees.value[i])})
    if (this.canGenerate(positions, employees) && this.durationInDays > 0 && this.durationInDays <= 31) {
      let state: GeneratorState = { config: new GeneratorConfigDto(employees, positions, Utils.fixDateToBackendFormat(this.startDate), Utils.fixDateToBackendFormat(this.finishDate)) }
      this.router.navigate(['employer','schedule-generator-result'], {state: state})
    }
  }

  shouldHighlight(employee: EmployeeDto): boolean {
    return this.highlightedPosition && employee.positions.some(p => p.id == this.highlightedPosition.id)
  }

  onSelectedPositionsChange() {
    for (let index = 0; index < this.employeeEnabled.length; index++) {
      this.employeeEnabled[index] = false      
    }
    this.positionChecked.forEach((checked, pi) => {
      if (checked) {
        for (let ei = 0; ei < this.employeeEnabled.length; ei++) {
          if (this.employeeService.employees.value[ei].positions.some(p => p.id == this.positionService.positions.value[pi].id)) {
            this.employeeEnabled[ei] = true
          }
        }
      }
    })
  }

  private canGenerate(positions: PositionDto[], employees: EmployeeDto[]): boolean {
    return employees.some(e => e.positions.some(ep => positions.some(p => p.id == ep.id)))
  }

  setAll(val: boolean, arr: boolean[]) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = val
    }
    this.onSelectedPositionsChange()
  }

}
