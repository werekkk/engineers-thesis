import { Component, OnInit } from '@angular/core';
import { HourPreferenceService } from 'src/app/app/services/hour-preference.service';
import { PreferencesWeekDto } from 'src/app/app/model/dto/PreferencesWeekDto';
import { TimeStep } from 'src/app/app/model/TimeStep';
import { PreferenceType } from 'src/app/app/model/PreferenceType';
import { PreferenceCreatedEvent } from '../preferences-week-editor/preferences-week-editor.component';
import { PeriodUtils } from 'src/app/app/shared/utils/period-utils';
import { HourPreferenceDto } from 'src/app/app/model/dto/HourPreferenceDto';

@Component({
  selector: 'preferences-week',
  templateUrl: './preferences-week.component.html',
  styleUrls: ['./preferences-week.component.scss']
})
export class PreferencesWeekComponent implements OnInit {

  preferencesLoaded = false

  timeStep: TimeStep = TimeStep.FIFTEEN_MINUTES
  selectedPreferenceType: PreferenceType = PreferenceType.DEFAULT
  preferencesWeek: PreferencesWeekDto = null

  constructor(
    public hourPreferencesService: HourPreferenceService
  ) {
    hourPreferencesService.preferencesWeek.subscribe(newWeek => {
      if (newWeek) {
        this.preferencesWeek = newWeek.copy()
      } else {
        this.preferencesWeek = newWeek
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
  }

  loadPreferences() {
    this.preferencesLoaded = false
    this.hourPreferencesService.getPreferencesWeek().subscribe(w => {
      this.preferencesLoaded = true
    })
  }

  onSaveClicked() {
    this.preferencesLoaded = false
    this.hourPreferencesService.savePreferencesWeek(this.preferencesWeek).subscribe(w => {
      this.preferencesLoaded = true
    })
  }

  handleNewPreferenceCreated(event: PreferenceCreatedEvent) {
    let preferencesDay = this.preferencesWeek.getDay(event.day)
    preferencesDay.preferences = PeriodUtils.insertPeriodAndOptimize(preferencesDay.preferences, event.preference) as HourPreferenceDto[]
    this.preferencesWeek = this.preferencesWeek.copy()
  }

}
