import { Component, OnInit } from '@angular/core';
import { HourPreferenceService } from 'src/app/app/services/hour-preference.service';
import { PreferencesWeekDto } from 'src/app/app/model/dto/PreferencesWeekDto';
import { TimeStep } from 'src/app/app/model/TimeStep';
import { PreferenceType } from 'src/app/app/model/PreferenceType';
import { PreferenceCreatedEvent } from '../preferences-week-editor/preferences-week-editor.component';
import { PeriodUtils } from 'src/app/app/shared/utils/period-utils';
import { HourPreferenceDto } from 'src/app/app/model/dto/HourPreferenceDto';
import { from, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangesModalResult, ChangesWillBeLostModalComponent } from '../../../shared/changes-will-be-lost-modal/changes-will-be-lost-modal.component';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'preferences-week',
  templateUrl: './preferences-week.component.html',
  styleUrls: ['./preferences-week.component.scss']
})
export class PreferencesWeekComponent implements OnInit {

  preferencesLoaded = false
  unsavedChanges = false

  timeStep: TimeStep = TimeStep.FIFTEEN_MINUTES
  selectedPreferenceType: PreferenceType = PreferenceType.DEFAULT
  preferencesWeek: PreferencesWeekDto = null

  constructor(
    public hourPreferencesService: HourPreferenceService,
    private modalService: NgbModal
  ) {
    hourPreferencesService.preferencesWeek.subscribe(newWeek => {
      if (newWeek) {
        this.preferencesWeek = newWeek.copy()
      }
    })
  }

  ngOnInit(): void {
    if (!this.hourPreferencesService.preferencesWeekLoaded) {
      this.loadPreferences()
    } else {
      this.preferencesWeek = this.hourPreferencesService.preferencesWeek.value.copy()
      this.preferencesLoaded = true
    }
    this.unsavedChanges = false;
  }

  loadPreferences() {
    this.preferencesLoaded = false
    this.hourPreferencesService.getPreferencesWeek().subscribe(w => {
      this.preferencesLoaded = true
    })
  }

  onSaveClicked() {
    this.savePreferences().subscribe()
  }

  savePreferences(): Observable<any> {
    this.preferencesLoaded = false
    return this.hourPreferencesService.savePreferencesWeek(this.preferencesWeek).pipe(
      map(w => {
        this.preferencesLoaded = true
        this.unsavedChanges = false
      })
      )
  }

  handleNewPreferenceCreated(event: PreferenceCreatedEvent) {
    let preferencesDay = this.preferencesWeek.getDay(event.day)
    preferencesDay.preferences = PeriodUtils.insertPeriodAndOptimize(preferencesDay.preferences, event.preference) as HourPreferenceDto[]
    this.preferencesWeek = this.preferencesWeek.shallowCopy()
    this.unsavedChanges = true
  }

  confirmUnsavedChanges(): Observable<boolean> {
    if (!this.unsavedChanges) {
      return of(true)
    }
    let modalRef = this.modalService.open(ChangesWillBeLostModalComponent, {windowClass: 'modal-appear', centered: true, size: 'sm'})
    modalRef.componentInstance.fromParent = ChangesWillBeLostModalComponent.PREFERENCES_CHANGES_DATA
    return from(modalRef.result).pipe(
      mergeMap((result: ChangesModalResult) => {
        switch (result) {
          case 'cancel':
            return of(false)
          case 'dismiss':
            return of(true)
          case 'save':
            return this.savePreferences().pipe(
              map(() => true, () => false)
            )
        }
      })
    )
  }
}
