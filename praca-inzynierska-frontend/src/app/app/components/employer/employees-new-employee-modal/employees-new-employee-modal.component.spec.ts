import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Observable, of } from 'rxjs'
import { AccountType } from 'src/app/app/model/AccountType'
import { AccountDto } from 'src/app/app/model/dto/AccountDto'
import { AddEmployeeDto } from 'src/app/app/model/dto/AddEmployeeDto'
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto'
import { EmployeeStatus } from 'src/app/app/model/EmployeeStatus'
import { EmployeeService } from 'src/app/app/services/employee.service'

import { EmployeesNewEmployeeModalComponent } from './employees-new-employee-modal.component'

class MockEmployeeService {
  addEmployee(employeeDto: AddEmployeeDto): Observable<EmployeeDto> {
    const savedEmployee = new EmployeeDto(
      1,
      new AccountDto(null, null, employeeDto.firstName, employeeDto.lastName, AccountType.EMPLOYEE),
      EmployeeStatus.INVITED,
      [],
      '1234567654321'
    )
    return of(savedEmployee)
  }
}

class MockModal {}

describe('EmployeesNewEmployeeModalComponent (class)', () => {
  let component: EmployeesNewEmployeeModalComponent
  let employeeService: EmployeeService
  let fixture: ComponentFixture<EmployeesNewEmployeeModalComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ 
        EmployeesNewEmployeeModalComponent,
        { provide: EmployeeService, useClass: MockEmployeeService },
        { provide: NgbActiveModal, useClass: MockModal },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      declarations: [
        EmployeesNewEmployeeModalComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule
      ]
    })
    component = TestBed.inject(EmployeesNewEmployeeModalComponent)
    employeeService = TestBed.inject(EmployeeService)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesNewEmployeeModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should display empty form after construction', () => {
    expect(component.firstName.value).toBeFalsy()
    expect(component.lastName.value).toBeFalsy()
  })

  it('should invalidate empty form', () => {
    // when
    fixture.debugElement.nativeElement.querySelector('#addBtn').click()
    // then
    expect(component.employeeForm.valid).toBeFalse()
  })

  it('should invalidate invalid input', () => {
    // given
    const fn = fixture.nativeElement.querySelector('#firstName')
    const ln = fixture.nativeElement.querySelector('#lastName')
    fn.value = 's'
    ln.value = 'a'
    fn.dispatchEvent(new Event('input'))
    ln.dispatchEvent(new Event('input'))
    // when
    fixture.nativeElement.querySelector('#addBtn').click()
    // then
    expect(component.employeeForm.valid).toBeFalse()
  })

  it('should save employee after adding and display invitation link', async () => {
    // given
    expect(fixture.nativeElement.querySelector('#invitationLinkDiv')).toBeFalsy()
    const fn = fixture.nativeElement.querySelector('#firstName')
    const ln = fixture.nativeElement.querySelector('#lastName')
    fn.value = 'Jan'
    ln.value = 'Kowalski'
    fn.dispatchEvent(new Event('input'))
    ln.dispatchEvent(new Event('input'))
    // when
    fixture.nativeElement.querySelector('#addBtn').click()
    // then
    await fixture.whenStable()
    employeeService.addEmployee(new AddEmployeeDto("Jan", "Kowalski"))
    .subscribe(e => expect(e).toEqual(component.savedEmployee))
    expect(fixture.nativeElement.querySelector('#invitationLinkDiv')).toBeTruthy()
    expect(fixture.nativeElement.querySelector('#linkInput').value).toContain('1234567654321')
  })

})