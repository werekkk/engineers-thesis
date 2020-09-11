import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';

interface FromParentData {
  employee: EmployeeDto
  deletedPositions: PositionDto[]
}

@Component({
  selector: 'confirm-position-change-modal',
  templateUrl: './confirm-position-change-modal.component.html',
  styleUrls: ['./confirm-position-change-modal.component.scss']
})
export class ConfirmPositionChangeModalComponent {

  fromParent: FromParentData

  constructor(
    public modal: NgbActiveModal
  ) { }

}
