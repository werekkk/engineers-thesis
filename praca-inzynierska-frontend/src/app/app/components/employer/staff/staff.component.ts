import { Component, OnInit } from '@angular/core';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { TimeStep } from 'src/app/app/model/TimeStep';
@Component({
  selector: 'staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  isPositionsLoading: boolean = undefined
  positions: PositionDto[] = []

  timeStep: TimeStep = TimeStep.DEFAULT

  activeId = 0

  constructor(
    private positionService: PositionService
  ) {
    this.positionService.positions.subscribe(newPositions => {
      this.positions = newPositions
    }) 
  }

  ngOnInit(): void {
    if (!this.positionService.positionsLoaded) {
      this.isPositionsLoading = true
      this.positionService.getAllPositions().subscribe(positions => {
        this.positions = positions
        this.isPositionsLoading = false
      })
    } else {
      this.isPositionsLoading = false
    }
  }

}
