import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { InvitationLinkPipe } from 'src/app/app/pipes/invitation-link.pipe';
import { Utils } from 'src/app/app/shared/utils/utils';

interface FromParentData {
  employee: EmployeeDto
}

@Component({
  selector: 'activation-link-modal',
  templateUrl: './activation-link-modal.component.html',
  styleUrls: ['./activation-link-modal.component.scss']
})
export class ActivationLinkModalComponent implements OnInit {

  copyLinkText: 'Kopiuj link' | 'Skopiowano!'

  fromParent: FromParentData

  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.copyLinkText = 'Kopiuj link'
  }

  onCopyLinkClicked() {
    let linkPipe = new InvitationLinkPipe()
    let link = linkPipe.transform(this.fromParent.employee) as string
    Utils.copyToClipboard(link)
    this.copyLinkText = 'Skopiowano!'
  }

}
