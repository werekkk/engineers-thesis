import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbDate, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { EmployeesNewEmployeeModalComponent } from '../employees-new-employee-modal/employees-new-employee-modal.component';
import { EmployeesEditGlobalPositionsModalComponent } from '../employees-edit-global-positions-modal/employees-edit-global-positions-modal.component';
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
    let modalRef = this.modalService.open(EmployeesNewEmployeeModalComponent, {windowClass: 'modal-appear', centered: true, size: 'lg'})
  }

  onEditPositionsClicked() {
    let modalRef = this.modalService.open(EmployeesEditGlobalPositionsModalComponent, {windowClass: 'modal-appear', centered: true, size: 'lg'})
  }

}
