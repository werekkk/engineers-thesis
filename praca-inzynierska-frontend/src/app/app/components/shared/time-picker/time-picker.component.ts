import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';
import { TimeStep } from 'src/app/app/model/TimeStep';
import { HourInputUtils } from 'src/app/app/shared/utils/hour-input-utils';
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { Time } from '@angular/common';
import * as moment from 'moment';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';

export type PickerType = 'shiftStart' | 'shiftFinish'

@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

  @Input()
  pickerType: PickerType

  @Input()
  shiftsTable: ShiftDto[][][]

  @Input()
  employee: EmployeeDto

  @Input()
  day: Date

  @Input()
  dayIndex: number

  @Input()
  requiredStaff: RequiredStaffDto

  @Input()
  beginTime: TimeDto

  _time: TimeDto = new TimeDto(0, 0, 0)
  @Input()
  set time(val: TimeDto) {
    this._time = val
    if (val.isMidnight()) {
      this.currentValue = '24:00'
    } else {
      this.currentValue = moment().hour(val.hour).minute(val.minute).format('HH:mm')
    }
  }
  get time(): TimeDto {
    return this._time
  }

  @Output()
  timeChange: EventEmitter<TimeDto> = new EventEmitter()

  timeStep: TimeStep = TimeStep.FIVE_MINUTES

  currentValue: string = '00:00'
  previousValue: string

  allHours = TimeStep.getAllTimeDtosByStep(this.timeStep)

  showSuggestions: boolean = false

  isMouseOverSuggestions: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

  handleHourSelected(selectedHour: TimeDto) {
    this.showSuggestions = false
    this.isMouseOverSuggestions = false
    if (selectedHour) {
      this.previousValue = selectedHour.toString()
      this.currentValue = selectedHour.toString()
      this.emitTimeChange()
    }
  }

  handleFocusIn() {
    this.showSuggestions = true
  }

  handleFocusOut(event: FocusEvent) {
    if (!this.isMouseOverSuggestions) {
      let hour = HourInputUtils.stringToHour(this.currentValue)
      if (hour) {
        this.previousValue = hour
        this.currentValue = hour
      } else {
        this.currentValue = this.previousValue
      }
      this.emitTimeChange()
      this.showSuggestions = false
    }
  }

  emitTimeChange() {
    if (this.currentValue != undefined && this.currentValue != this.time.toHHMMString()) {
      let newTime = new TimeDto(+this.currentValue.substr(0, 2), +this.currentValue.substr(3, 2))
      this.timeChange.emit(newTime)
    }
  }

}
