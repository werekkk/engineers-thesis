import { Component, OnInit, Input } from '@angular/core';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { Utils } from 'src/app/app/shared/Utils';
import { StaffRequirementsService } from 'src/app/app/services/staff-requirements.service';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { Router } from '@angular/router';
import { SchedulePostitionWeekData } from '../schedule-position-week-edit/schedule-position-week-edit.component';

@Component({
  selector: 'schedule-position-week',
  templateUrl: './schedule-position-week.component.html',
  styleUrls: ['./schedule-position-week.component.scss']
})
export class SchedulePositionWeekComponent implements OnInit {

  @Input('position')
  position: PositionDto

  @Input('firstDate')
  firstDay: Date

  requiredStaffLoaded = false

  requiredStaff: RequiredStaffDto

  constructor(
    private staffRequirementsService: StaffRequirementsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.requiredStaffLoaded = false
    this.staffRequirementsService.getPositionRequirements(this.position.id).subscribe(rs => {
      this.handleRequiredStaffResponse(rs)
      this.requiredStaffLoaded = true
    })
  }

  private handleRequiredStaffResponse(rs: RequiredStaffDto) {
    this.requiredStaff = rs
  }

  daysAfter(date: Date, days: number): Date {
    return Utils.daysAfter(date, days)
  }

  onPositionScheduleEditClicked(positionId: number) {
    let data: SchedulePostitionWeekData = {
      position: this.position,
      firstDay: this.firstDay
    }
    this.router.navigate(['employer', 'schedule', 'position', positionId, 'week'], {state: {data: data}})
  }

}
