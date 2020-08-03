import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequiredStaffTimePeriodDto } from 'src/app/app/model/dto/RequiredStaffTimePeriodDto';
import { Utils } from 'src/app/app/shared/Utils';

@Component({
  selector: 'staff-requirements-day',
  templateUrl: './staff-requirements-day.component.html',
  styleUrls: ['./staff-requirements-day.component.scss']
})
export class StaffRequirementsDayComponent{

  @Input('timePeriods')
  timePeriods: RequiredStaffTimePeriodDto[] = []

  @Output('timePeriodsChange')
  timePeriodsChange: EventEmitter<RequiredStaffTimePeriodDto[]> = new EventEmitter()

  highlightedPeriodIndex = undefined

  handleNewTimePeriods(newPeriods: RequiredStaffTimePeriodDto[]) {
    if (newPeriods.length > 0) {
      let lastP = newPeriods.pop()
      newPeriods = Utils.insertRequirementAndOptimize(newPeriods, lastP)
    }
    this.timePeriods = newPeriods
    this.timePeriodsChange.emit(newPeriods)
  }

}
