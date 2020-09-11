import { Component, OnInit, OnDestroy } from '@angular/core';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { TimeStep } from 'src/app/app/model/TimeStep';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { StaffRequirementsService } from 'src/app/app/services/staff-requirements.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit, OnDestroy {

  isPositionsLoading: boolean = true
  positions: PositionDto[] = []

  timeStep: TimeStep = TimeStep.DEFAULT

  activeId = 0

  staffRequirements: RequiredStaffDto = null

  private positionSubscription: Subscription

  constructor(
    private positionService: PositionService,
    private staffRequirementsService: StaffRequirementsService
  ) {
    this.positionSubscription = this.positionService.positions.subscribe(newPositions => {
      this.positions = newPositions
      if (this.positions.length > 0) {
        this.reloadStaffRequirements(this.activeId)
      }
    }) 
  }

  ngOnInit(): void {
    if (!this.positionService.positionsLoaded) {
      this.isPositionsLoading = true
      this.positionService.getAllPositions().subscribe(positions => {
        this.isPositionsLoading = false
      })
    } else {
      this.isPositionsLoading = false
    }
  }

  ngOnDestroy(): void {
    this.positionSubscription.unsubscribe()
  }

  onPositionChange() {
    this.staffRequirements = null
    if (this.positions.length > 0) {
      this.reloadStaffRequirements(this.activeId)
    }
  }

  reloadStaffRequirements(activeId: number) {
    this.staffRequirementsService.getPositionRequirements(this.positions[activeId].id)
    .subscribe(rs => {
      this.staffRequirements = rs
      this.activeId = activeId
    })
  }

  onSaveClicked() {
    let savedReqs = this.staffRequirements
    this.staffRequirements = null
    this.staffRequirementsService.savePositionRequirements(this.positions[this.activeId].id, savedReqs)
    .subscribe(rs => {
      this.staffRequirements = rs
    }, err => {this.staffRequirements = savedReqs})
  }

}
