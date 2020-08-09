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
export class StaffRequirementsComponent implements OnInit {

  isLoading: boolean = undefined

  @Input('position')
  position: PositionDto

  @Input('timeStep')
  timeStep: TimeStep

  @Output('timeStepChange')
  timeStepChange: EventEmitter<TimeStep> = new EventEmitter()

  staffRequirements: RequiredStaffDto

  constructor(
    private staffRequirementsService: StaffRequirementsService
  ) { }

  ngOnInit(): void {
    this.isLoading = true
    this.staffRequirementsService.getPositionRequirements(this.position.id)
    .subscribe(rs => {
      this.isLoading = false
      this.staffRequirements = rs
    })
  }

  onSaveClicked() {
    this.isLoading = true
    this.staffRequirementsService.savePositionRequirements(this.position.id, this.staffRequirements)
    .subscribe(rs => {
      this.isLoading = false
      this.staffRequirements = rs
    }, err => {this.isLoading = false})
  }

}
