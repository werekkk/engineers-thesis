import { Component, OnInit, Input } from '@angular/core';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';

@Component({
  selector: 'time-period-cell',
  templateUrl: './time-period-cell.component.html',
  styleUrls: ['./time-period-cell.component.scss']
})
export class TimePeriodCellComponent implements OnInit {

  @Input('timePeriod')
  timePeriod: TimePeriodDto

  constructor() { }

  ngOnInit(): void {
  }

}
