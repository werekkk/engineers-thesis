import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { PreferencesWeekDto } from '../model/dto/PreferencesWeekDto'
import { environment } from 'src/environments/environment';
import { PreferencesWeekBackendDto } from '../model/dto/backend/PreferencesWeekBackendDto';
import { OneTimeHourPreferencesDto } from '../model/dto/OneTimeHourPreferencesDto';
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { OneTimeHourPreferenceDto } from '../model/dto/OneTimeHourPreferenceDto';

@Injectable({
  providedIn: 'root'
})
export class HourPreferenceService {

  preferencesWeekLoaded = false
  preferencesWeek: BehaviorSubject<PreferencesWeekDto> = new BehaviorSubject(null)

  constructor(
    public http: HttpClient
  ) { }

  getPreferencesWeek(): Observable<PreferencesWeekDto> {
    return this.http.get(`${environment.serverUrl}/preference/week`, {withCredentials: true})
    .pipe(
      map((response: PreferencesWeekBackendDto) => PreferencesWeekDto.of(response)),
      tap(pw => this.handleNewPreferencesWeek(pw))
    )
  }

  savePreferencesWeek(preferencesWeek: PreferencesWeekDto): Observable<PreferencesWeekDto> {
    preferencesWeek = preferencesWeek.copy()
    preferencesWeek.filterOutDefaultPreferences()
    let backendFormat = PreferencesWeekBackendDto.of(preferencesWeek)
    return this.http.post(`${environment.serverUrl}/preference/week`, backendFormat, {withCredentials: true})
    .pipe(
      map((response: PreferencesWeekBackendDto) => PreferencesWeekDto.of(response)),
      tap(pw => this.handleNewPreferencesWeek(pw))
    )
  }

  private handleNewPreferencesWeek(pw: PreferencesWeekDto) {
    pw.sortPreferences()
    pw.fillEmptyPeriodsWithDefaultPreference()
    this.preferencesWeekLoaded = true
    this.preferencesWeek.next(pw)
  }

  getOneTimePreferencesByPeriod(start: Date, finish: Date): Observable<OneTimeHourPreferencesDto> {
    let params = new HttpParams()
    .append('start', moment(start).format('DDMMyyyy'))
    .append('finish', moment(finish).format('DDMMyyyy'))
    return this.http.get(`${environment.serverUrl}/preference/one-time`, {params: params, withCredentials: true})
    .pipe(
      map((ps: OneTimeHourPreferencesDto) => OneTimeHourPreferencesDto.toObject(ps))
    )
  }

  setOneTimePreferencesByDay(preferences: OneTimeHourPreferenceDto[], day: Date): Observable<OneTimeHourPreferencesDto> {
    let body = OneTimeHourPreferencesDto.toObject(new OneTimeHourPreferencesDto(preferences))
    body.datesToBackend()
    let params = new HttpParams()
    .append('day', moment(day).format('DDMMyyyy'))
    return this.http.post(`${environment.serverUrl}/preference/one-time`, body, {params: params, withCredentials: true})
    .pipe(
      map((ps: OneTimeHourPreferencesDto) => OneTimeHourPreferencesDto.toObject(ps))
    )
  }
}
