import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbDate, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NewEmployeeModalComponent } from '../new-employee-modal/new-employee-modal.component';
import { EditGlobalPositionsModalComponent } from '../edit-global-positions-modal/edit-global-positions-modal.component';
import { EmployeeService } from 'src/app/app/services/employee.service';
import { PositionService } from 'src/app/app/services/position.service';

@Component({
  selector: 'employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private employeeService: EmployeeService,
    private positionService: PositionService
  ) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe()
    this.positionService.getAllPositions().subscribe()
  }

  onAddEmployeeClicked() {
    let modalRef = this.modalService.open(NewEmployeeModalComponent, {windowClass: 'modal-appear', centered: true, size: 'lg'})
  }

  onEditPositionsClicked() {
    let modalRef = this.modalService.open(EditGlobalPositionsModalComponent, {windowClass: 'modal-appear', centered: true, size: 'lg'})
  }

}
