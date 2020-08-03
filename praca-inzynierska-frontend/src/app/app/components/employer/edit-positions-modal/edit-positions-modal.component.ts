import { Component, OnInit, Input } from '@angular/core';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { Utils } from 'src/app/app/shared/Utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'edit-positions-modal',
  templateUrl: './edit-positions-modal.component.html',
  styleUrls: ['./edit-positions-modal.component.scss']
})
export class EditPositionsModalComponent implements OnInit {

  isLoading = false

  @Input() 
  fromParent: FromParentData;

  positions: PositionDto[]

  positionSelected: boolean[]

  constructor(
    private activeModal: NgbActiveModal,
    private positionService: PositionService
  ) {
    positionService.getAllPositions().subscribe()
  }

  ngOnInit(): void {
    this.positionService.positions.subscribe(newPositions => {
      this.positions = newPositions
      this.positionSelected = Utils.emptyBooleanArray(newPositions.length)
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

interface FromParentData {
  employee: EmployeeDto
}