import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { TimeDto } from 'src/app/app/model/dto/TimeDto';

@Component({
  selector: 'time-period-picker',
  templateUrl: './time-period-picker.component.html',
  styleUrls: ['./time-period-picker.component.scss']
})
export class TimePeriodPickerComponent implements OnInit {

  @Input('period')
  period: TimePeriodDto = new TimePeriodDto(new TimeDto(0, 0), new TimeDto(0, 0))

  @Output('periodChange')
  periodChange: EventEmitter<TimePeriodDto> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  onTimeChange() {
    this.periodChange.emit(this.period)
  }

}
