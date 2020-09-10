import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';

interface FromParentData {
  position: PositionDto
}

@Component({
  selector: 'confirm-delete-position-modal',
  templateUrl: './confirm-delete-position-modal.component.html',
  styleUrls: ['./confirm-delete-position-modal.component.scss']
})
export class ConfirmDeletePositionModalComponent {

  fromParent: FromParentData

  constructor(
    public modal: NgbActiveModal
  ) { }

}
