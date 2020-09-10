import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';

interface FromParentData {
  employee: EmployeeDto
}

@Component({
  selector: 'confirm-delete-employee-modal',
  templateUrl: './confirm-delete-employee-modal.component.html',
  styleUrls: ['./confirm-delete-employee-modal.component.scss']
})
export class ConfirmDeleteEmployeeModalComponent {

  fromParent: FromParentData

  constructor(
    public modal: NgbActiveModal
  ) { }

}
