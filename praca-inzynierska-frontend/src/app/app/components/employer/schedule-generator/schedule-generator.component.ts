import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { PositionService } from 'src/app/app/services/position.service';
import { EmployeeService } from 'src/app/app/services/employee.service';
import { ScheduleGeneratorService } from 'src/app/app/services/schedule-generator.service';
import { Utils } from 'src/app/app/shared/utils/utils';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { Router } from '@angular/router';
import { GeneratorRequest, GeneratorState } from '../schedule-generator-result/schedule-generator-result.component';
import { GeneratorConfigDto } from 'src/app/app/model/dto/GeneratorConfigDto';


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

  durationInDays: number

  constructor(
    public positionService: PositionService,
    public employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.onDurationChange()
    this.positionsLoaded = this.positionService.positionsLoaded
    this.employeesLoaded = this.employeeService.employeesLoaded
    if (!this.positionsLoaded) {
      this.positionService.getAllPositions().subscribe(() => {
      this.positionsLoaded = true
      this.initCheckedArrays()
      })
    }
    if (!this.employeesLoaded) {
      this.employeeService.getAllEmployees().subscribe(() => {
        this.employeesLoaded = true
        this.initCheckedArrays()
      })
    }
  }

  onDurationChange() {
    this.durationInDays = moment(this.finishDate).add(1, 'day').diff(this.startDate, 'day')
  }

  initCheckedArrays() {
    if (this.positionService.positionsLoaded && this.employeeService.employeesLoaded) {
      this.positionChecked = Utils.emptyBooleanArray(this.positionService.positions.value.length)
      this.employeeChecked = Utils.emptyBooleanArray(this.employeeService.employees.value.length)
    }
  }

  onGenerateClicked() {
    let positions: PositionDto[] = []
    let employees: EmployeeDto[] = []
    this.positionChecked.forEach((val, i) => {if (val) positions.push(this.positionService.positions.value[i])})
    this.employeeChecked.forEach((val, i) => {if (val) employees.push(this.employeeService.employees.value[i])})
    let state: GeneratorState = { config: new GeneratorConfigDto(employees, positions, this.startDate, this.finishDate) }
    this.router.navigate(['employer','schedule-generator-result'], {state: state})
  }

}
