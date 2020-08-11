import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeStatus } from '../../../model/EmployeeStatus'
import { AddEmployeeDto } from '../../../model/dto/AddEmployeeDto'
import { EmployeeService } from '../../../services/employee.service'
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';

@Component({
  selector: 'employees-new-employee-modal',
  templateUrl: './employees-new-employee-modal.component.html',
  styleUrls: ['./employees-new-employee-modal.component.scss']
})
export class EmployeesNewEmployeeModalComponent implements OnInit {

  showForm = true
  showLink = false
  isLoading = false

  withoutAccount = EmployeeStatus.WITHOUT_ACCOUNT
  withAccount = EmployeeStatus.INVITED

  savedEmployee: EmployeeDto
  invitationLink: string = ''

  // Corresponds with 'AddEmployeeDto'
  employeeForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    lastName: new FormControl('', Validators.required),
    employmentDate: new FormControl(''),
    employeeStatus: new FormControl(this.withAccount, Validators.required)
  })

  constructor(
    public activeModal: NgbActiveModal,
    private employerService: EmployeeService
  ) { }

  ngOnInit(): void {
  }

  onSaveClicked() {
    if (this.employeeForm.valid) {
      let newEmployee: AddEmployeeDto = this.employeeForm.value
      this.showForm = false
      this.isLoading = true
      this.employerService.addEmployee(newEmployee)
      .subscribe((savedEmployee: EmployeeDto) => {
        this.onEmployeeAdded(savedEmployee)
      })
    }
  }

  private onEmployeeAdded(employee: EmployeeDto) {
    if (employee.employeeStatus == EmployeeStatus.WITHOUT_ACCOUNT) {
      this.activeModal.close(employee)
    } else {
      this.isLoading = false
      this.showLink = true
      this.savedEmployee = employee
      this.invitationLink = EmployeeService.generateInvitationLink(employee.invitationToken)
    }
  }

  onInvitatationLinkCloseClicked() {
    this.activeModal.close(this.savedEmployee)
  }

}