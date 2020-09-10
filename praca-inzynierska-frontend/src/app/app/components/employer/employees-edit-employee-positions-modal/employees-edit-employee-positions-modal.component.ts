import { Component, OnInit, Input } from '@angular/core';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { Utils } from 'src/app/app/shared/utils/utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    private positionService: PositionService
  ) {
  }

  ngOnInit(): void {
    if (!this.positionService.positionsLoaded) {
      this.positionService.getAllPositions().subscribe()
    }
    this.positionService.positions.subscribe(newPositions => {
      newPositions.sort((a, b) => a.name.localeCompare(b.name))
      this.positions = newPositions
      this.positionSelected = Utils.emptyBooleanArray(newPositions.length)
      this.fromParent.employee.positions.forEach(ep => {
        this.positionSelected[this.positions.findIndex(p => ep.id == p.id)] = true
      })
    })
  }

  onSavePositionsClicked() {
    let selectedPositions = this.positions.filter((v, i) => this.positionSelected[i])
    this.isLoading = true
    this.positionService.setEmployeePositions(this.fromParent.employee, selectedPositions)
    .subscribe(() => {
      this.isLoading
      this.activeModal.close()
    })
  }

}