import { Component, OnInit, Input } from '@angular/core';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';

@Component({
  selector: 'schedule-calendar-cell',
  templateUrl: './schedule-calendar-cell.component.html',
  styleUrls: ['./schedule-calendar-cell.component.scss']
})
export class ScheduleCalendarCellComponent {

  @Input('shifts')
  shifts: ShiftDto[]

  constructor() { }
}
