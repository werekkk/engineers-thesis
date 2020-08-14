import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OneTimeHourPreferenceDto } from 'src/app/app/model/dto/OneTimeHourPreferenceDto';
import * as moment from 'moment';
import { Moment } from 'moment';
import { TimeStep } from 'src/app/app/model/TimeStep';
import { PreferenceType } from 'src/app/app/model/PreferenceType';
import { HourPreferenceService } from 'src/app/app/services/hour-preference.service';
import { PreferencesWeekDto } from 'src/app/app/model/dto/PreferencesWeekDto';
import { PeriodUtils } from 'src/app/app/shared/utils/period-utils';
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { Utils } from '../../../../shared/utils/utils'

export type FromParentData = {
  day: Date,
  preferences: OneTimeHourPreferenceDto[]
}

export type SavedPreferences = {
  day: Date,
  preferences: OneTimeHourPreferenceDto[]
}

@Component({
  selector: 'preferences-one-time-day-modal',
  templateUrl: './preferences-one-time-day-modal.component.html',
  styleUrls: ['./preferences-one-time-day-modal.component.scss']
})
export class PreferencesOneTimeDayModalComponent implements OnInit {

  weekLoaded = false

  timeStep: TimeStep = TimeStep.FIFTEEN_MINUTES
  selectedPreferenceType: PreferenceType = PreferenceType.DEFAULT

  day: Moment

  _preferences: OneTimeHourPreferenceDto[]
  get preferences(): OneTimeHourPreferenceDto[] {
    return this._preferences
  }
  set preferences(val: OneTimeHourPreferenceDto[]) {
    this._preferences = val.map(p => p)
  }
  preferencesWeek: PreferencesWeekDto

  @Input()
  fromParent: FromParentData

  constructor(
    public activeModal: NgbActiveModal,
    private hourPreferenceService: HourPreferenceService
  ) { 
    hourPreferenceService.preferencesWeek.subscribe(pw => this.preferencesWeek = pw)
  }

  ngOnInit(): void {
    this.day = moment(this.fromParent.day).locale('pl')
    this.preferences = this.fromParent.preferences
    this.weekLoaded = this.hourPreferenceService.preferencesWeekLoaded
    if (!this.weekLoaded) {
      this.hourPreferenceService.getPreferencesWeek().subscribe(() => this.weekLoaded = true)
    }
  }

  onSaveClicked() {
    this.hourPreferenceService.setOneTimePreferencesByDay(this.preferences, this.day.toDate())
    .subscribe(savedPrefs => {
      this.activeModal.close({day: this.day.toDate(), preferences: savedPrefs.preferences} as SavedPreferences)
    })
  }

  handlePreferenceCreated(newPreference: OneTimeHourPreferenceDto) {
    this.preferences = PeriodUtils.insertPeriodAndOptimize(this.preferences, newPreference) as OneTimeHourPreferenceDto[]
    this.preferences = this.preferences.map(p => p)
  }

  getTypeColor(preference: OneTimeHourPreferenceDto): string {
    return PreferenceType.toColor(preference.type)
  }

  onDeletePreferenceClicked(index: number) {
    this.preferences.splice(index, 1)
    this.preferences = this.preferences.map(p => p)
  }

}
