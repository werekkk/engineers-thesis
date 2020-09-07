import { Component, OnInit, Input } from '@angular/core';
import { Moment } from 'moment';
import { Utils } from 'src/app/app/shared/utils/utils';
import * as moment from 'moment';
import { OneTimeHourPreferenceDto } from 'src/app/app/model/dto/OneTimeHourPreferenceDto';
import { HourPreferenceService } from 'src/app/app/services/hour-preference.service';
import { OneTimeHourPreferencesDto } from 'src/app/app/model/dto/OneTimeHourPreferencesDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreferencesOneTimeDayModalComponent } from '../preferences-one-time-day-modal/preferences-one-time-day-modal.component';
import { PreferenceType } from 'src/app/app/model/PreferenceType';
import { SavedPreferences } from '../preferences-one-time-day-modal/preferences-one-time-day-modal.component'

type CalendarDayClickedEvent = {
  weekIndex: number,
  dayIndex: number
}

@Component({
  selector: 'preferences-one-time-calendar',
  templateUrl: './preferences-one-time-calendar.component.html',
  styleUrls: ['./preferences-one-time-calendar.component.scss']
})
export class PreferencesOneTimeCalendarComponent {

  month: Moment
  preferencesLoaded: boolean = false

  @Input('month')
  set monthDate(val: Date) {
    this.preferencesLoaded = false
    this.month = moment(val)
    this.calendarDays = Utils.getDateArrayForCalendar(this.month)
    this.loadPreferencesForMonth()
  }

  calendarDays: Date[][] = []
  oneTimeHourPreferences: OneTimeHourPreferenceDto[][][] = []  

  today: Date = new Date()

  constructor(
    private hourPreferenceService: HourPreferenceService,
    private modalService: NgbModal
  ) { }

  loadPreferencesForMonth() {
    this.preferencesLoaded = false
    this.hourPreferenceService.getOneTimePreferencesByPeriod(
      this.calendarDays[0][0],
      this.calendarDays[this.calendarDays.length - 1][6]
    ).subscribe(prefs => this.handleNewMonthPreferences(prefs.preferences))
  }

  onDayClicked(event: CalendarDayClickedEvent) {
    let date = this.calendarDays[event.weekIndex][event.dayIndex]
    let prefs = this.oneTimeHourPreferences[event.weekIndex][event.dayIndex]
    let modalRef = this.modalService.open(PreferencesOneTimeDayModalComponent, {windowClass: 'modal-appear wide-modal', size: 'lg'})
    modalRef.componentInstance.fromParent = {
      day: date,
      preferences: prefs
    }
    modalRef.result.then((result: SavedPreferences) => {
      let diff = Utils.daysDiff(this.calendarDays[0][0], result.day)
      this.oneTimeHourPreferences[Math.floor(diff/7)][diff%7] = result.preferences
    }, ()=>null)
  }

  private handleNewMonthPreferences(preferences: OneTimeHourPreferenceDto[]) {
    let firstDay = this.calendarDays[0][0]
    this.initPrefsArray()
    preferences.sort((a, b) => a.start.getTime() - b.start.getTime())
    preferences.forEach(pref => {
      let diff = Utils.daysDiff(firstDay, pref.start)
      this.oneTimeHourPreferences[Math.floor(diff/7)][diff%7].push(pref)
    })
    this.preferencesLoaded = true
  }

  private initPrefsArray() {
    this.oneTimeHourPreferences = []
    this.calendarDays.forEach(() => {
      let prefWeek = [[],[],[],[],[],[],[]]
      this.oneTimeHourPreferences.push(prefWeek)
    })
  }

  getTypeColor(preference: OneTimeHourPreferenceDto): string {
    return PreferenceType.toColor(preference.type)
  }
}
