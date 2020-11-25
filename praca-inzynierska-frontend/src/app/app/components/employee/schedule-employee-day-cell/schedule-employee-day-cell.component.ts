import { Component, OnInit, Input } from '@angular/core';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';

@Component({
  selector: 'schedule-employee-day-cell',
  templateUrl: './schedule-employee-day-cell.component.html',
  styleUrls: ['./schedule-employee-day-cell.component.scss']
})
export class ScheduleEmployeeDayCellComponent implements OnInit {

  @Input()
  shifts: ShiftDto[]

  constructor() { }

  ngOnInit(): void {
  }

}
