import { Component, OnInit } from '@angular/core';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletePositionModalComponent } from '../confirm-delete-position-modal/confirm-delete-position-modal.component';

@Component({
  selector: 'employees-edit-global-positions-modal',
  templateUrl: './employees-edit-global-positions-modal.component.html',
  styleUrls: ['./employees-edit-global-positions-modal.component.scss']
})
export class EmployeesEditGlobalPositionsModalComponent {

  editedName: string = ''

  isLoading = false
  positions: PositionDto[]

  newPositionName: string

  currentlyEditedPositionIndex: number = null

  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private positionService: PositionService
  ) {
    positionService.positions.subscribe(p => {
      this.positions = p
    })
    if (!positionService.positionsLoaded) {
      this.isLoading = true
      positionService.getAllPositions().subscribe(() => this.isLoading = false)
    }
  }

  onAddPositionClicked() {
    if (this.newPositionName) {
      let newPosition = new PositionDto(null, this.newPositionName)
      this.positionService.savePosition(newPosition).subscribe()
      this.newPositionName = ''
    }
  }

  onDeletePositionClicked(position: PositionDto) {
    let modalRef = this.modalService.open(ConfirmDeletePositionModalComponent, {windowClass: 'modal-appear', centered: true, size: 'md'})
    modalRef.componentInstance.fromParent = {position: position}
    modalRef.result.then((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.isLoading = true
        this.positionService.deletePosition(position.id).subscribe(() => this.isLoading = false)
      }
    }, () => null)
  }

  setEditedPosition(index: number) {
    this.currentlyEditedPositionIndex = index
    if (index != null) {
      this.editedName = this.positions[index].name
    }
  }

  onSaveEditClicked() {
    if (this.editedName) {
      let position = this.positions[this.currentlyEditedPositionIndex]
      if (this.editedName == position.name) {
        this.setEditedPosition(null)
      } else {
        this.positionService.savePosition(new PositionDto(position.id, this.editedName), true).subscribe(() => {
          this.setEditedPosition(null)
        })
      }
    }
  }

}
