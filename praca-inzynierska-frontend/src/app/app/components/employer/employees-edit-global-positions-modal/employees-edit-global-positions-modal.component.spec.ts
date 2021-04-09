import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { BehaviorSubject, of } from 'rxjs'
import { PositionDto } from 'src/app/app/model/dto/PositionDto'
import { PositionService } from 'src/app/app/services/position.service'
import { ConfirmDeletePositionModalComponent } from '../confirm-delete-position-modal/confirm-delete-position-modal.component'

import { EmployeesEditGlobalPositionsModalComponent } from './employees-edit-global-positions-modal.component'

class MockPositionService {
  positionsLoaded = false
  positions: BehaviorSubject<PositionDto[]> = new BehaviorSubject([])
  getAllPositions() {
    return of([])
  }
  savePosition(np: PositionDto) {
    let val = this.positions.value.filter(p => p.id != np.id)
    this.positions.next(val.concat(np))
    return of(np)
  }
  deletePosition(d: number) {
    this.positions.next(this.positions.value.filter(p => p.id != d))
    return of(d)
  }
}

class MockModal {}

describe('EmployeesEditGlobalPositionsModalComponent', () => {
  let component: EmployeesEditGlobalPositionsModalComponent
  let positionService: PositionService
  let fixture: ComponentFixture<EmployeesEditGlobalPositionsModalComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ 
        EmployeesEditGlobalPositionsModalComponent,
        ConfirmDeletePositionModalComponent,
        { provide: PositionService, useClass: MockPositionService },
        { provide: NgbActiveModal, useClass: MockModal },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      declarations: [
        EmployeesEditGlobalPositionsModalComponent,
        ConfirmDeletePositionModalComponent
      ],
      imports: [
        FormsModule
      ]
    })
    component = TestBed.inject(EmployeesEditGlobalPositionsModalComponent)
    positionService = TestBed.inject(PositionService)
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesEditGlobalPositionsModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should display message when no positions', () => {
    // when
    positionService.positions.next([])
    // then
    expect(fixture.nativeElement.querySelector('.no-positions')).toBeTruthy()
  })

  it('should display sorted positions when one or more positions', async () => {
    // given
    expect(fixture.nativeElement.querySelector('.no-positions')).toBeTruthy()
    expect(fixture.nativeElement.querySelector('.position-rows')).toBeFalsy()
    // when
    positionService.positions.next([new PositionDto(1, "pos2"), new PositionDto(2, "pos1")])
    // then
    await fixture.whenStable()
    expect(fixture.nativeElement.querySelector('.no-positions')).toBeFalsy()
    const container = fixture.nativeElement.querySelector('.position-rows') as HTMLDivElement
    expect(container.children.length).toBe(2)
    expect(container.childNodes[0].textContent).toContain('pos2')
    expect(container.childNodes[1].textContent).toContain('pos1')
  })

  it('should show added position', async () => {
    // given
    expect(fixture.nativeElement.querySelector('.no-positions')).toBeTruthy()
    expect(component.positions.length).toBe(0)
    // when
    fixture.nativeElement.querySelector('#newPosition').value = 'new position'
    fixture.nativeElement.querySelector('#newPosition').dispatchEvent(new Event('input'))
    fixture.nativeElement.querySelector('#addPositionBtn').click()
    // then
    await fixture.whenStable()
    expect(fixture.nativeElement.querySelector('.no-positions')).toBeFalsy()
    const container = fixture.nativeElement.querySelector('.position-rows') as HTMLDivElement
    expect(container.children.length).toBe(1)
    expect(container.childNodes[0].textContent).toContain('new position')
    expect(component.positions.length).toBe(1)
    expect(component.positions[0].name).toBe('new position')
  })

  it('should display warning message when removing', async () => {
    // given
    expect(fixture.nativeElement.parentElement.textContent).not.toContain('Czy na pewno chcesz usunąć stanowisko "pos2"')
    positionService.positions.next([new PositionDto(1, 'pos1'), new PositionDto(2, 'pos2'), new PositionDto(3, 'pos3')])
    await fixture.whenStable()
    // when
    fixture.nativeElement.querySelector('.position-row:nth-child(2) #deletePositionBtn').click()
    // then
    await fixture.whenStable()
    expect(fixture.nativeElement.parentElement.textContent).toContain('Czy na pewno chcesz usunąć stanowisko "pos2"')
    fixture.nativeElement.parentElement.querySelector('#confirmDeleteBtn').click()
  })

  it('should remove deleted position', async () => {
    // given
    positionService.positions.next([new PositionDto(1, 'pos1'), new PositionDto(2, 'pos2'), new PositionDto(3, 'pos3')])
    await fixture.whenStable()    
    let container = fixture.nativeElement.querySelector('.position-rows') as HTMLDivElement
    expect(component.positions.length).toBe(3)
    expect(container.children.length).toBe(3)
    // when
    fixture.nativeElement.querySelector('.position-row:nth-child(2) #deletePositionBtn').click()
    await fixture.whenStable()
    fixture.nativeElement.parentElement.querySelector('#confirmDeleteBtn').click()
    // then
    await fixture.whenStable()
    expect(component.positions.length).toBe(2)
    expect(container.children.length).toBe(2)
    expect(container.childNodes[0].textContent).toContain('pos1')
    expect(container.childNodes[1].textContent).toContain('pos3')
  })

  it('should change input when clicking edit', async () => {
    // given
    positionService.positions.next([new PositionDto(2, 'pos2')])
    await fixture.whenStable()    
    expect(component.editedName).toBe('')
    expect(fixture.nativeElement.querySelector('#positionNameLabel')).toBeTruthy()
    expect(fixture.nativeElement.querySelector('#editedName')).toBeFalsy()
    // when
    fixture.nativeElement.querySelector('#editPositionBtn').click()
    // then
    await fixture.whenStable()
    expect(component.editedName).toBe('pos2')
    expect(fixture.nativeElement.querySelector('#positionNameLabel')).toBeFalsy()
    expect(fixture.nativeElement.querySelector('#editedName')).toBeTruthy()    
    expect(fixture.nativeElement.querySelector('#editedName').value).toBe('pos2')    
  })

  it('should apply edited position name', async () => {
    // given
    positionService.positions.next([new PositionDto(2, 'pos2')])
    await fixture.whenStable() 
    // when
    fixture.nativeElement.querySelector('#editPositionBtn').click()
    fixture.nativeElement.querySelector('#editedName').value = 'newName'
    fixture.nativeElement.querySelector('#editedName').dispatchEvent(new Event('input'))
    fixture.nativeElement.querySelector('#saveEditBtn').click()
    // then
    await fixture.whenStable()
    expect(component.positions[0].name).toBe('newName')
    expect(fixture.nativeElement.textContent).not.toContain('pos2')
    expect(fixture.nativeElement.textContent).toContain('newName')
  })
})
