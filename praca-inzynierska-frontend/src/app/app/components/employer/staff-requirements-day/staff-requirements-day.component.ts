import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequiredStaffTimePeriodDto } from 'src/app/app/model/dto/RequiredStaffTimePeriodDto';
import { PeriodUtils } from 'src/app/app/shared/utils/period-utils';
import { TimeStep } from 'src/app/app/model/TimeStep';

@Component({
  selector: 'staff-requirements-day',
  templateUrl: './staff-requirements-day.component.html',
  styleUrls: ['./staff-requirements-day.component.scss']
})
export class StaffRequirementsDayComponent{
  
  @Input()
  dayExpression: string = ''
  
  @Input()
  positionName: string = ''

  @Input()
  timeStep: TimeStep

  @Input()
  timePeriods: RequiredStaffTimePeriodDto[] = []

  @Output()
  timePeriodsChange: EventEmitter<RequiredStaffTimePeriodDto[]> = new EventEmitter()

  highlightedPeriodIndex = undefined

  handleNewTimePeriods(newPeriods: RequiredStaffTimePeriodDto[]) {
    if (newPeriods.length > 0) {
      let lastP = newPeriods.pop()
      newPeriods = PeriodUtils.insertPeriodAndOptimize(newPeriods, lastP) as RequiredStaffTimePeriodDto[]
    }
    this.timePeriods = newPeriods
    this.timePeriodsChange.emit(newPeriods)
  }

}
