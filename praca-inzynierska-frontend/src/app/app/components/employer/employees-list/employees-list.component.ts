import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/app/services/employee.service';
import { AccountDto } from 'src/app/app/model/dto/AccountDto';
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeesEditEmployeePositionsModalComponent } from '../employees-edit-employee-positions-modal/employees-edit-employee-positions-modal.component';
import { EmployeeStatus } from 'src/app/app/model/EmployeeStatus';
import { ConfirmDeleteEmployeeModalComponent } from '../confirm-delete-employee-modal/confirm-delete-employee-modal.component';
import { ActivationLinkModalComponent } from '../activation-link-modal/activation-link-modal.component';

@Component({
  selector: 'employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {

  employees: EmployeeDto[]

  constructor(
    private employerService: EmployeeService,
    private modalService: NgbModal
  ) {
    employerService.employees.subscribe(e => {
      this.employees = e.sort(EmployeeDto.compare)
    })
  }

  ngOnInit(): void {}

  onAssignPositionsClicked(employee: EmployeeDto) {
    let modalRef = this.modalService.open(EmployeesEditEmployeePositionsModalComponent, {windowClass: 'modal-appear', centered: true, size: 'md'})
    modalRef.componentInstance.fromParent = {
      employee: employee
    }
  }

  onDeleteClicked(employee: EmployeeDto) {
    let modalRef = this.modalService.open(ConfirmDeleteEmployeeModalComponent, {windowClass: 'modal-appear', centered: true, size: 'md'})
    modalRef.componentInstance.fromParent = { employee: employee }
    modalRef.result.then((shouldDelete: boolean) => {
      if (shouldDelete) {
        this.employerService.deleteEmployee(employee.employeeId).subscribe()
      }
    }, () => null)
  }
  
  onActivationLinkClicked(employee: EmployeeDto) {
    let modalRef = this.modalService.open(ActivationLinkModalComponent, {windowClass: 'modal-appear modal-dynamic-width', centered: true, size: 'sm'})
    modalRef.componentInstance.fromParent = { employee: employee }
  }

}
