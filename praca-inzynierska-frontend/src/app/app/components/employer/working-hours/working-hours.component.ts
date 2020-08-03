import { Component, OnInit } from '@angular/core';
import { WorkingHoursService } from '../../../services/working-hours.service'
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { WorkingHoursDto } from 'src/app/app/model/dto/WorkingHoursDto';

@Component({
  selector: 'working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit {

  workingHours: WorkingHoursDto = null

  constructor(
    private workingHoursService: WorkingHoursService
  ) { }

  ngOnInit(): void {
    this.workingHoursService.getWorkingHours()
    .subscribe((workingHours: WorkingHoursDto) => this.workingHours = workingHours)
  }

  onSaveHoursClicked() {
    this.workingHoursService.saveWorkingHours(this.workingHours)
    .subscribe()
  }

}
