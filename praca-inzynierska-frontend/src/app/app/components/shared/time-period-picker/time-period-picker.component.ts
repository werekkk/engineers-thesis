import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { Time } from '@angular/common';

@Component({
  selector: 'time-period-picker',
  templateUrl: './time-period-picker.component.html',
  styleUrls: ['./time-period-picker.component.scss']
})
export class TimePeriodPickerComponent implements OnInit {

  @Input('requiredStaff')
  requiredStaff: RequiredStaffDto
  
  @Input('shiftsTable')
  shiftsTable: ShiftDto[][][]

  @Input('employee')
  employee: EmployeeDto
  
  @Input('day')
  day: Date

  @Input('dayIndex')
  dayIndex: number

  @Input('period')
  period: TimePeriodDto = new TimePeriodDto(new TimeDto(0, 0), new TimeDto(0, 0))

  @Output('periodChange')
  periodChange: EventEmitter<TimePeriodDto> = new EventEmitter()

  beginTime: TimeDto = new TimeDto(0, 0)

  constructor() { }

  ngOnInit(): void {
  }

  onTimeChange() {
    this.beginTime = this.period.start
    this.periodChange.emit(this.period)
  }

}
