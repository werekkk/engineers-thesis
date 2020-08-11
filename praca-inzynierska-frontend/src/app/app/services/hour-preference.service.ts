import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreferencesWeekDto } from '../model/dto/PreferencesWeekDto'
import { environment } from 'src/environments/environment';
import { PreferencesWeekBackendDto } from '../model/dto/backend/PreferencesWeekBackendDto';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HourPreferenceService {

  constructor(
    public http: HttpClient
  ) { }

  getPreferencesWeek(): Observable<PreferencesWeekDto> {
    return this.http.get(`${environment.serverUrl}/preference/week`, {withCredentials: true})
    .pipe(
      map((response: PreferencesWeekBackendDto) => PreferencesWeekDto.of(response)),
      tap(pw => pw.sortPreferences()),
      tap(pw => pw.fillEmptyPeriodsWithDefaultPreference())
    )
  }

  savePreferencesWeek(preferencesWeek: PreferencesWeekDto): Observable<PreferencesWeekDto> {
    preferencesWeek = preferencesWeek.copy()
    preferencesWeek.filterOutDefaultPreferences()
    let backendFormat = PreferencesWeekBackendDto.of(preferencesWeek)
    return this.http.post(`${environment.serverUrl}/preference/week`, backendFormat, {withCredentials: true})
    .pipe(
      map((response: PreferencesWeekBackendDto) => PreferencesWeekDto.of(response)),
      tap(pw => pw.fillEmptyPeriodsWithDefaultPreference())
    )
  }
}
