import { Component, OnInit, Input } from '@angular/core';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { PositionService } from 'src/app/app/services/position.service';

@Component({
  selector: 'schedule-calendar-cell',
  templateUrl: './schedule-calendar-cell.component.html',
  styleUrls: ['./schedule-calendar-cell.component.scss']
})
export class ScheduleCalendarCellComponent {

  @Input()
  shifts: ShiftDto[]

  constructor(
    private positionService: PositionService
  ) { }

  lookupPositionName(shift: ShiftDto): string {
    if (this.positionService.positionsLoaded) {
      return this.positionService.positions.value.find(s => s.id == shift.positionId).name
    } else {
      return ''
    }
  }
}
