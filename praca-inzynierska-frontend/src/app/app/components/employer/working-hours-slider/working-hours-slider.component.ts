import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { Utils } from '../../../shared/utils/utils'
import { TimeDto } from 'src/app/app/model/dto/TimeDto';

@Component({
  selector: 'working-hours-slider',
  templateUrl: './working-hours-slider.component.html',
  styleUrls: ['./working-hours-slider.component.scss']
})
export class WorkingHoursSliderComponent implements OnInit {

  @Input('timePeriod')
  timePeriod: TimePeriodDto

  @Output('timePeriodChange')
  timePeriodChange: EventEmitter<TimePeriodDto> = new EventEmitter<TimePeriodDto>()

  constructor() { }

  ngOnInit(): void {
  }

  onClosedClicked() {
    let defaultTimePeriod = TimePeriodDto.default()
    this.timePeriodChange.emit(defaultTimePeriod)
  }

  onRemovePeriodClicked() {
    this.timePeriodChange.emit(null)
  }

  onStartChanged(event: any) {
    this.timePeriod.start = new TimeDto(event['hour'], event['minute'], event['second'])
  }

  onFinishChanged(event: any) {
    this.timePeriod.finish = new TimeDto(event['hour'], event['minute'], event['second'])
  }
}
