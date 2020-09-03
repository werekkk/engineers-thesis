import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HourInputUtils } from '../../../shared/utils/hour-input-utils'
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { IntegratedIntervals } from 'src/app/app/shared/utils/integrated-intervals';
import { PickerType } from '../time-picker/time-picker.component';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';

@Component({
  selector: 'time-picker-suggestions',
  templateUrl: './time-picker-suggestions.component.html',
  styleUrls: ['./time-picker-suggestions.component.scss']
})
export class TimePickerSuggestionsComponent implements OnInit, AfterViewInit {

  @ViewChild('suggestions')
  suggestionsDiv: ElementRef<HTMLDivElement>

  @Output('mouseOver')
  mouseOver: EventEmitter<boolean> = new EventEmitter()

  @Input('allHours')
  allHours: TimeDto[]

  @Input('userInput')
  set userInput(val: string) {
    this.handleUserInput(val)
  }

  @Input('pickerType')
  pickerType: PickerType

  @Input('shiftsTable')
  shiftsTable: ShiftDto[][][]

  @Input('employee')
  employee: EmployeeDto

  @Input('day')
  day: Date

  @Input('dayIndex')
  dayIndex: number

  @Input('requiredStaff')
  requiredStaff: RequiredStaffDto

  @Input('beginTime')
  beginTime: TimeDto

  highlightedHour: TimeDto = null
  requiredStaffIntervals: IntegratedIntervals
  assignedStaffIntervals: IntegratedIntervals

  @Output('hourSelected')
  onHourSelected: EventEmitter<TimeDto> = new EventEmitter()

  requiredEmployees: number[] = []
  assignedEmployees: number[] = []

  constructor() { }

  ngOnInit(): void {
    this.initRequiredStaffIntervals()
    this.initAssignedStaffIntervals()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.pickerType == 'shiftStart') {
        let firstHourIndex = this.findFirstHourStartIndex()
        if (firstHourIndex >= 0) {
          this.highlightHour(this.allHours[firstHourIndex])
        }
      }
      if (this.pickerType == 'shiftFinish') {
        this.highlightHour(this.beginTime)
      }
    })
  }

  private findFirstHourStartIndex(): number {
    let firstHour = this.requiredEmployees.findIndex((req, index) => {
      return req >= 1 && this.assignedEmployees[index] < req
    })
    return firstHour
  }

  initRequiredStaffIntervals() {
    let shiftFinishPenalty = this.pickerType == 'shiftFinish' ? 1 : 0
    this.requiredStaffIntervals = new IntegratedIntervals()
    this.requiredStaff.getDayStaff(this.day).timePeriods.forEach(rs => {
      this.requiredStaffIntervals.add(rs.timePeriod.start.toSeconds() + shiftFinishPenalty, rs.timePeriod.finish.toSeconds() + shiftFinishPenalty, rs.employeeCount)
    })
    this.requiredEmployees = []
    this.allHours.forEach(h => this.requiredEmployees.push(this.requiredStaffIntervals.sum(h.toSeconds())))
  }

  initAssignedStaffIntervals() {
    let shiftFinishPenalty = this.pickerType == 'shiftFinish' ? 1 : 0
    this.assignedStaffIntervals = new IntegratedIntervals()
    this.getAllShiftsForDay().forEach(shift => {
      let period = shift.period
      this.assignedStaffIntervals.add(period.start.toSeconds() + shiftFinishPenalty, period.finish.toSeconds() + shiftFinishPenalty, 1)
    })
    this.assignedEmployees = []
    this.allHours.forEach(h => this.assignedEmployees.push(this.assignedStaffIntervals.sum(h.toSeconds())))
  }

  private getAllShiftsForDay(): ShiftDto[] {
    let shifts: ShiftDto[] = []
    this.shiftsTable.forEach(emp => {
      shifts = shifts.concat(emp[this.dayIndex])
    })
    return shifts
  }

  selectHour(index: number) {
    this.onHourSelected.emit(this.allHours[index])
  }

  private handleUserInput(userInput: string) {
    let closestHour = HourInputUtils.stringToClosestHour(userInput, this.allHours)
    this.highlightHour(closestHour)
  }

  highlightHour(hour: TimeDto) {
    let elem = document.getElementById(hour ? hour.toHHMMString() : '') as HTMLElement
    if (elem) {
      this.highlightedHour = hour
      this.suggestionsDiv.nativeElement.scrollTop = elem.offsetTop
    } else {
      this.highlightedHour = null
    }
  }

  onMouseEnter() {
    this.mouseOver.emit(true)
  }

  onMouseLeave() {
    this.mouseOver.emit(false)
  }

  
}
