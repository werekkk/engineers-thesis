import { Component, OnInit, Input } from '@angular/core';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { Utils } from 'src/app/app/shared/utils/utils';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPositionChangeModalComponent } from '../confirm-position-change-modal/confirm-position-change-modal.component';

interface FromParentData {
  employee: EmployeeDto
}

@Component({
  selector: 'employees-edit-employee-positions-modal',
  templateUrl: './employees-edit-employee-positions-modal.component.html',
  styleUrls: ['./employees-edit-employee-positions-modal.component.scss']
})
export class EmployeesEditEmployeePositionsModalComponent implements OnInit {

  isLoading = false

  @Input() 
  fromParent: FromParentData;

  positions: PositionDto[]

  positionSelected: boolean[]

  constructor(
    public activeModal: NgbActiveModal,
    private positionService: PositionService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    if (!this.positionService.positionsLoaded) {
      this.positionService.getAllPositions().subscribe()
    }
    this.positionService.positions.subscribe(newPositions => {
      this.positions = newPositions.sort((a, b) => a.name.localeCompare(b.name))
      this.positionSelected = Utils.emptyBooleanArray(newPositions.length)
      this.fromParent?.employee.positions.forEach(ep => {
        this.positionSelected[this.positions.findIndex(p => ep.id == p.id)] = true
      })
    })
  }

  onSavePositionsClicked() {
    let selectedPositions = this.positions.filter((v, i) => this.positionSelected[i])
    let deletedPositions = this.getDeletedPositions(this.fromParent.employee.positions, selectedPositions)
    
    if (deletedPositions.length != 0) {
      let modalRef = this.modalService.open(ConfirmPositionChangeModalComponent, {windowClass: 'modal-appear', centered: true, size: 'md'})
      modalRef.componentInstance.fromParent = {
        employee: this.fromParent.employee,
        deletedPositions: deletedPositions
      }
      modalRef.result.then((shouldSave) => {
        if (shouldSave) {
          this.savePositionsAndClose(selectedPositions)
        }
      }, () => null)
    } else {
      this.savePositionsAndClose(selectedPositions)
    }
  }

  private savePositionsAndClose(newPositions: PositionDto[]) {
    this.isLoading = true
    this.positionService.setEmployeePositions(this.fromParent.employee, newPositions)
    .subscribe(() => {
      this.activeModal.close()
    })
  }

  private getDeletedPositions(oldPositions: PositionDto[], newPositions: PositionDto[]): PositionDto[] {
    let deletedPositions: PositionDto[] = []
    oldPositions.forEach(op => {
      if (!newPositions.some(np => op.id == np.id)) {
        deletedPositions.push(op)
      }
    })
    return deletedPositions 
  }

}