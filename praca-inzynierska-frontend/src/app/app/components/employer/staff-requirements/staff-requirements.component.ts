import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { StaffRequirementsService } from '../../../services/staff-requirements.service'
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { TimeStep } from 'src/app/app/model/TimeStep';

@Component({
  selector: 'staff-requirements',
  templateUrl: './staff-requirements.component.html',
  styleUrls: ['./staff-requirements.component.scss']
})
export class StaffRequirementsComponent {

  isLoading: boolean = undefined

  @Input('position')
  position: PositionDto

  @Input('timeStep')
  timeStep: TimeStep

  @Input('staffRequirements')
  staffRequirements: RequiredStaffDto

  @Output('staffRequirementsChange')
  staffRequirementsChange: EventEmitter<RequiredStaffDto> = new EventEmitter()

  constructor() { }

  emitRequirementsChange() {
    this.staffRequirementsChange.emit(this.staffRequirements)
  }

}
