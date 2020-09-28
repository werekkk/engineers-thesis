import { Component, OnInit, OnDestroy } from '@angular/core';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { TimeStep } from 'src/app/app/model/TimeStep';
import { RequiredStaffDto } from 'src/app/app/model/dto/RequiredStaffDto';
import { StaffRequirementsService } from 'src/app/app/services/staff-requirements.service';
import { from, Observable, of, Subscription } from 'rxjs';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ChangesWillBeLostModalComponent } from '../../shared/changes-will-be-lost-modal/changes-will-be-lost-modal.component';
import { ChangesModalResult } from '../../shared/changes-will-be-lost-modal/changes-will-be-lost-modal.component';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit, OnDestroy {

  isPositionsLoading: boolean = true
  positions: PositionDto[] = []

  timeStep: TimeStep = TimeStep.DEFAULT

  activeId = 0

  staffRequirements: RequiredStaffDto = null

  unsavedChanges: boolean = false

  private positionSubscription: Subscription

  constructor(
    private positionService: PositionService,
    private staffRequirementsService: StaffRequirementsService,
    private modalService: NgbModal
  ) {
    this.positionSubscription = this.positionService.positions.subscribe(newPositions => {
      this.positions = newPositions
      if (this.positions.length > 0) {
        this.reloadStaffRequirements(this.activeId)
      }
    }) 
  }

  ngOnInit(): void {
    this.unsavedChanges = false
    if (!this.positionService.positionsLoaded) {
      this.isPositionsLoading = true
      this.positionService.getAllPositions().subscribe(positions => {
        this.isPositionsLoading = false
      })
    } else {
      this.isPositionsLoading = false
    }
  }

  ngOnDestroy(): void {
    this.positionSubscription.unsubscribe()
  }

  onTabChange(changeEvent: NgbNavChangeEvent) {
    if (this.unsavedChanges) {
      changeEvent.preventDefault()
      this.confirmUnsavedChanges().subscribe(shouldProceed => {
        if (shouldProceed) {
          this.activeId = changeEvent.nextId
          this.onPositionChange()
        }
      })
    }
  }

  onPositionChange() {
    this.staffRequirements = null
    if (this.positions.length > 0) {
      this.reloadStaffRequirements(this.activeId)
    }
  }

  reloadStaffRequirements(activeId: number) {
    this.staffRequirementsService.getPositionRequirements(this.positions[activeId].id)
    .subscribe(rs => {
      this.staffRequirements = rs
      this.activeId = activeId
      this.unsavedChanges = false
    })
  }

  onSaveClicked() {
    this.savePositionRequirements().subscribe()
  }

  private savePositionRequirements(): Observable<any> {
    let savedReqs = this.staffRequirements
    this.staffRequirements = null
    return this.staffRequirementsService.savePositionRequirements(this.positions[this.activeId].id, savedReqs)
    .pipe(
      map(rs => {
        this.staffRequirements = rs
        this.unsavedChanges = false
      }, err => {this.staffRequirements = savedReqs})
    )
  }

  confirmUnsavedChanges(): Observable<boolean> {
    if (!this.unsavedChanges) {
      return of(true)
    }
    let modalRef = this.modalService.open(ChangesWillBeLostModalComponent, {windowClass: 'modal-appear', centered: true, size: 'sm'})
    modalRef.componentInstance.fromParent = ChangesWillBeLostModalComponent.STAFF_CHANGES_DATA
    return from(modalRef.result).pipe(
      mergeMap((result: ChangesModalResult) => {
        switch (result) {
          case 'cancel':
            return of(false)
          case 'dismiss':
            return of(true)
          case 'save':
            return this.savePositionRequirements().pipe(
              map(() => true, () => false)
            )
        }
      })
    )
  }

}
