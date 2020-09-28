import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ChangesModalResult, ChangesWillBeLostModalComponent } from '../../shared/changes-will-be-lost-modal/changes-will-be-lost-modal.component';
import { ScheduleGeneratorComponent } from '../schedule-generator/schedule-generator.component';
import { ScheduleGeneratorResultComponent } from './schedule-generator-result.component';

@Injectable({
  providedIn: 'root'
})
export class CheckUnsavedGeneratedScheduleGuard implements CanDeactivate<ScheduleGeneratorResultComponent> {

  constructor(
    private modalService: NgbModal
  ) {}

  canDeactivate(component: ScheduleGeneratorResultComponent): Observable<boolean>| boolean {
    if (!component.scheduleGenerated || component.shiftsSaved) {
      return true
    } else {
      let modalRef = this.modalService.open(ChangesWillBeLostModalComponent, {windowClass: 'modal-appear', centered: true, size: 'sm'})
      modalRef.componentInstance.fromParent = ChangesWillBeLostModalComponent.GENERATED_SCHEDULE_DATA
      return from(modalRef.result).pipe(
        mergeMap((result: ChangesModalResult) => {
          switch (result) {
            case 'cancel':
              return of(false)
            case 'dismiss':
              return of(true)
            case 'save':
              return component.saveShifts().pipe(
                map(() => true, () => false)
              )
          }
        })
      )
    }
  }

}
