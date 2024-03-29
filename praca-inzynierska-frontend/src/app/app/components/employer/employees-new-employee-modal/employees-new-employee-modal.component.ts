import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddEmployeeDto } from '../../../model/dto/AddEmployeeDto'
import { EmployeeService } from '../../../services/employee.service'
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto';
import { Utils } from 'src/app/app/shared/utils/utils';

@Component({
  selector: 'employees-new-employee-modal',
  templateUrl: './employees-new-employee-modal.component.html',
  styleUrls: ['./employees-new-employee-modal.component.scss']
})
export class EmployeesNewEmployeeModalComponent implements OnInit {

  showForm = true
  showLink = false
  isLoading = false

  savedEmployee: EmployeeDto
  invitationLink = ''

  copyLinkText: 'Kopiuj link' | 'Skopiowano!'

  // Corresponds with 'AddEmployeeDto'
  employeeForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)])
  })

  get firstName(): FormControl { return this.employeeForm.get('firstName') as FormControl }
  get lastName(): FormControl { return this.employeeForm.get('lastName') as FormControl }

  constructor(
    public activeModal: NgbActiveModal,
    private employerService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.copyLinkText = 'Kopiuj link'
  }

  onSaveClicked() {
    this.employeeForm.markAllAsTouched()
    if (this.employeeForm.valid) {
      const newEmployee: AddEmployeeDto = this.employeeForm.value
      this.showForm = false
      this.isLoading = true
      this.employerService.addEmployee(newEmployee)
      .subscribe((savedEmployee: EmployeeDto) => {
        this.onEmployeeAdded(savedEmployee)
      })
    }
  }

  private onEmployeeAdded(employee: EmployeeDto) {
    this.isLoading = false
    this.showLink = true
    this.savedEmployee = employee
    this.invitationLink = EmployeeService.generateInvitationLink(employee.invitationToken)
  }

  onInvitatationLinkCloseClicked() {
    this.activeModal.close(this.savedEmployee)
  }

  onCopyLinkClicked() {
    Utils.copyToClipboard(this.invitationLink)
    this.copyLinkText = 'Skopiowano!'
  }

}
