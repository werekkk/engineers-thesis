import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RequiredStaffTimePeriodDto } from 'src/app/app/model/dto/RequiredStaffTimePeriodDto';
import { Utils } from 'src/app/app/shared/utils';

@Component({
  selector: 'staff-requirements-period-list',
  templateUrl: './staff-requirements-period-list.component.html',
  styleUrls: ['./staff-requirements-period-list.component.scss']
})
export class StaffRequirementsPeriodListComponent implements OnInit {

  @Input('timePeriods')
  timePeriods: RequiredStaffTimePeriodDto[] = []

  @Output('timePeriodsChange')
  timePeriodsChange: EventEmitter<RequiredStaffTimePeriodDto[]> = new EventEmitter()

  @Input('highlightedPeriodIndex')
  highlightedPeriodIndex: number = undefined

  @Output('highlightedPeriodIndexChange')
  highlightedPeriodIndexChange: EventEmitter<number> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  onDeletePeriodClicked(periodIndex: number) {
    this.timePeriods.splice(periodIndex, 1)
    this.highlightedPeriodIndexChange.emit(undefined)
    this.timePeriodsChange.emit(Object.assign([], this.timePeriods))
  }

  onMouseEnterPeriod(periodIndex: number) {
    this.highlightedPeriodIndexChange.emit(periodIndex)
  }

  onMouseLeave() {
    this.highlightedPeriodIndexChange.emit(undefined)
  }

}
