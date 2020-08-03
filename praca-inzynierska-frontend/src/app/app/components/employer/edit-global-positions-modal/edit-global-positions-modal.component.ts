import { Component, OnInit } from '@angular/core';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';

@Component({
  selector: 'edit-global-positions-modal',
  templateUrl: './edit-global-positions-modal.component.html',
  styleUrls: ['./edit-global-positions-modal.component.scss']
})
export class EditGlobalPositionsModalComponent implements OnInit {

  isLoading = true
  positions: PositionDto[]

  newPositionName: string

  constructor(
    private positionService: PositionService
  ) {
    positionService.getAllPositions().subscribe(positions => {
      this.positions = positions
      positionService.positions.subscribe(newPositions => {
        this.positions = newPositions
      })
      this.isLoading = false
    })
  }

  ngOnInit(): void {
  }

  onAddPositionClicked() {
    if (this.newPositionName) {
      let newPosition = new PositionDto(null, this.newPositionName)
      this.positionService.savePosition(newPosition).subscribe()
      this.newPositionName = ''
    }
  }

  onDeletePositionClicked(position: PositionDto) {
    this.isLoading = true
    this.positionService.deletePosition(position.id).subscribe(() => this.isLoading = false)
  }

}
