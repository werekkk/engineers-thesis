import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';

interface FromParentData {
  employee: EmployeeDto
}

@Component({
  selector: 'activation-link-modal',
  templateUrl: './activation-link-modal.component.html',
  styleUrls: ['./activation-link-modal.component.scss']
})
export class ActivationLinkModalComponent {

  fromParent: FromParentData

  constructor(
    public modal: NgbActiveModal
  ) { }

}
