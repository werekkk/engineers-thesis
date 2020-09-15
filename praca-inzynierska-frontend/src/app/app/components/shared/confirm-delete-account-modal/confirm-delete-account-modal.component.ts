import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm-delete-account-modal',
  templateUrl: './confirm-delete-account-modal.component.html',
  styleUrls: ['./confirm-delete-account-modal.component.scss']
})
export class ConfirmDeleteAccountModalComponent {

  constructor(
    public modal: NgbActiveModal
  ) { }

}
