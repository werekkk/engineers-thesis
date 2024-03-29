import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    if (!this.employeeService.employeesLoaded)
      this.employeeService.getAllEmployees().subscribe()
    if (!this.positionService.positionsLoaded)
      this.positionService.getAllPositions().subscribe()
  }

  onAddEmployeeClicked() {
    let modalRef = this.modalService.open(EmployeesNewEmployeeModalComponent, {windowClass: 'modal-appear modal-dynamic-width', centered: true, size: 'sm'})
  }

  onEditPositionsClicked() {
    let modalRef = this.modalService.open(EmployeesEditGlobalPositionsModalComponent, {windowClass: 'modal-appear', centered: true, size: 'md'})
  }

}
