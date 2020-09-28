import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.modalService.dismissAll()
  }

  onReturnClicked() {
    this.navigateToLoginPage()
  }

  private navigateToLoginPage() {
    window.location.replace(window.location.origin + environment.baseHref)
  }
}
