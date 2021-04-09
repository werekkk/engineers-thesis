import { IterableDiffers } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BehaviorSubject } from 'rxjs'
import { AccountType } from 'src/app/app/model/AccountType'
import { AccountDto } from 'src/app/app/model/dto/AccountDto'
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto'
import { PositionDto } from 'src/app/app/model/dto/PositionDto'
import { EmployeeStatus } from 'src/app/app/model/EmployeeStatus'
import { EmployeeService } from 'src/app/app/services/employee.service'
import { AccountLabelComponent } from 'src/app/app/components/shared/account-label/account-label.component'

import { EmployeesListComponent } from './employees-list.component'

class MockEmployeeService {
  employees = new BehaviorSubject<EmployeeDto[]>([])
  deleteEmployee(id: number){}
}

describe('EmployeesListComponent', () => {
  let component: EmployeesListComponent
  let employeeService: EmployeeService
  let fixture: ComponentFixture<EmployeesListComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        EmployeesListComponent,
        AccountLabelComponent
       ],
      providers: [
        EmployeesListComponent,
        { provide: EmployeeService, useClass: MockEmployeeService }
      ],
    })
    component = TestBed.inject(EmployeesListComponent)
    employeeService = TestBed.inject(EmployeeService)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  let e1 = new EmployeeDto(
    1, 
    new AccountDto('', '', 'Adam', 'Abacki', AccountType.EMPLOYEE), 
    EmployeeStatus.HAS_ACCOUNT, 
    [new PositionDto(1, 'pos1')],
    null
  )
  let e2 = new EmployeeDto(
    1, 
    new AccountDto('', '', 'Adam', 'Wabacki', AccountType.EMPLOYEE), 
    EmployeeStatus.INVITED, 
    [new PositionDto(1, 'pos1'), new PositionDto(2, 'pos2')],
    'link'
  )
  let e3 = new EmployeeDto(
    1, 
    new AccountDto('', '', 'Zdzisław', 'Zdzisławski', AccountType.EMPLOYEE), 
    EmployeeStatus.HAS_ACCOUNT, 
    [],
    null
  )

  it('should display employees in alphabetical order', () => {
    // given
    employeeService.employees.next([e3, e1, e2])
    // then
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(1)').textContent).toContain('Adam')
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(1)').textContent).toContain('Abacki')
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(2)').textContent).toContain('Adam')
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(2)').textContent).toContain('Wabacki')
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(3)').textContent).toContain('Zdzisław')
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(3)').textContent).toContain('Zdzisławski')
  })

  it('should display no positions when no positions', () => {
    // given
    employeeService.employees.next([e3])
    // then
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(1)').textContent).toContain('brak stanowisk')
  })

  it('should display positions when one or more positions', () => {
    // given
    employeeService.employees.next([e1, e2])
    // then
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(1)').textContent).toContain('pos1')
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(1)').textContent).not.toContain('pos2')
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(2)').textContent).toContain('pos1')
    expect(fixture.nativeElement.querySelector('tbody tr:nth-child(2)').textContent).toContain('pos2')
  })

  it('should display warning modal when deleting', async () => {
    // given
    employeeService.employees.next([e1])
    expect(fixture.nativeElement.parentElement.querySelector('#confirmDeleteEmployeeModal')).toBeFalsy()
    // when
    fixture.detectChanges()
    fixture.nativeElement.querySelector('#deleteEmployeeBtn').click()
    // then
    fixture.detectChanges()
    await fixture.whenStable()
    expect(fixture.nativeElement.parentElement.querySelector('#confirmDeleteEmployeeModal')).toBeTruthy()
    fixture.nativeElement.parentElement.querySelector('#confirmDeleteEmployeeBtn').click()
  })

})
