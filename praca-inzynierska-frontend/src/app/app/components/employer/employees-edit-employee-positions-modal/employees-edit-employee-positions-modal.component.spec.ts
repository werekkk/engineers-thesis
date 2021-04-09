import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { BehaviorSubject, of } from 'rxjs'
import { AccountType } from 'src/app/app/model/AccountType'
import { AccountDto } from 'src/app/app/model/dto/AccountDto'
import { EmployeeDto } from 'src/app/app/model/dto/EmployeeDto'
import { PositionDto } from 'src/app/app/model/dto/PositionDto'
import { EmployeeStatus } from 'src/app/app/model/EmployeeStatus'
import { PositionService } from 'src/app/app/services/position.service'
import { ConfirmPositionChangeModalComponent } from '../confirm-position-change-modal/confirm-position-change-modal.component'

import { EmployeesEditEmployeePositionsModalComponent } from './employees-edit-employee-positions-modal.component'

class MockPositionService {
  positions: BehaviorSubject<PositionDto[]> = new BehaviorSubject([])
  getAllPositions() {
    return of([])
  }
  setEmployeePositions(e: EmployeeDto, newPositions: PositionDto[]) {
    this.positions.next(newPositions)
    e.positions = newPositions
    return of(e)
  }
}

class MockModal {
  close() {}
}

describe('EmployeesEditEmployeePositionsModalComponent', () => {
  let component: EmployeesEditEmployeePositionsModalComponent
  let positionService: PositionService
  let fixture: ComponentFixture<EmployeesEditEmployeePositionsModalComponent>

  let testEmployee = { employee: new EmployeeDto(
    1, 
    new AccountDto('', '', 'Jan', 'Kowalski', AccountType.EMPLOYEE),
    EmployeeStatus.HAS_ACCOUNT,
    [],
    '')
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeesEditEmployeePositionsModalComponent,
        ConfirmPositionChangeModalComponent,
        { provide: PositionService, useClass: MockPositionService },
        { provide: NgbActiveModal, useClass: MockModal },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      declarations: [ 
        EmployeesEditEmployeePositionsModalComponent,
        ConfirmPositionChangeModalComponent
      ],
      imports: [
        FormsModule
      ]
    })
    component = TestBed.inject(EmployeesEditEmployeePositionsModalComponent)
    positionService = TestBed.inject(PositionService)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesEditEmployeePositionsModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should display employees name', () => {
    // given
    component.fromParent = testEmployee
    // then
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('#title').textContent).toContain('Jan Kowalski')
  })

  it('should display message when no positions', () => {
    // given
    component.fromParent = testEmployee
    positionService.positions.next([])
    // then
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('.no-positions')).toBeTruthy()
    expect(fixture.nativeElement.textContent).toContain('Brak dostępnych stanowisk!')
  })

  it('should display all available positions', () => {
    // given
    component.fromParent = testEmployee
    positionService.positions.next([new PositionDto(3, 'pos3'), new PositionDto(2, 'pos2'), new PositionDto(1, 'pos1')])
    // then
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('.no-positions')).toBeFalsy()
    const container = fixture.nativeElement.querySelector('.position-rows') as HTMLDivElement
    expect(container.children.length).toBe(3)
    expect(container.children[0].textContent).toContain('pos1')
    expect(container.children[1].textContent).toContain('pos2')
    expect(container.children[2].textContent).toContain('pos3')
  })

  it('should mark eployees positions', async () => {
    // given
    component.fromParent = testEmployee
    component.fromParent.employee.positions = [new PositionDto(1, 'pos1'), new PositionDto(3, 'pos3')]
    positionService.positions.next([new PositionDto(3, 'pos3'), new PositionDto(2, 'pos2'), new PositionDto(1, 'pos1')])
    // then
    fixture.detectChanges()
    await fixture.whenStable()
    const container = fixture.nativeElement.querySelector('.position-rows') as HTMLDivElement
    expect((container.childNodes[0] as HTMLElement).querySelector('input').checked).toBeTrue()
    expect((container.childNodes[1] as HTMLElement).querySelector('input').checked).toBeFalse()
    expect((container.childNodes[2] as HTMLElement).querySelector('input').checked).toBeTrue()
  })

  it('should display confirmation modal when removing position', async () => {
    // given
    component.fromParent = testEmployee
    component.fromParent.employee.positions = [new PositionDto(1, 'pos1'), new PositionDto(3, 'pos3')]
    positionService.positions.next([new PositionDto(3, 'pos3'), new PositionDto(2, 'pos2'), new PositionDto(1, 'pos1')])
    // when
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.nativeElement.querySelector('.position-rows *:nth-child(3) input').click()
    fixture.nativeElement.querySelector('#saveBtn').click()
    // then
    await fixture.whenStable()
    const modal = fixture.nativeElement.parentElement.querySelector('#confirmChangePositionsModal')
    expect(modal).toBeTruthy()
    expect(modal.textContent).toContain('pos3')
    fixture.nativeElement.parentElement.querySelector('#saveChangesBtn').click()
  })

  it('should save new positions', async () => {
    // given
    component.fromParent = testEmployee
    component.fromParent.employee.positions = [new PositionDto(1, 'pos1'), new PositionDto(3, 'pos3')]
    positionService.positions.next([new PositionDto(3, 'pos3'), new PositionDto(2, 'pos2'), new PositionDto(1, 'pos1')])
    // when
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.nativeElement.querySelector('.position-rows *:nth-child(2) input').click()
    fixture.nativeElement.querySelector('.position-rows *:nth-child(3) input').click()
    fixture.nativeElement.querySelector('#saveBtn').click()
    await fixture.whenStable()
    fixture.nativeElement.parentElement.querySelector('#saveChangesBtn').click()
    // then
    await fixture.whenStable()
    expect(positionService.positions.value).toEqual([new PositionDto(1, 'pos1'), new PositionDto(2, 'pos2')])
  })
})
