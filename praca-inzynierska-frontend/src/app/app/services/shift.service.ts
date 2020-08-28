import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, noop, of } from 'rxjs';
import { ShiftsDto } from '../model/dto/ShiftsDto'
import { SavedShiftResponseDto } from '../model/dto/SavedShiftResponseDto'
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ShiftDto } from '../model/dto/ShiftDto';
import { SchedulePostitionWeekData } from '../components/employer/schedule-position-week-edit/schedule-position-week-edit.component';
import { subscribeOn, tap, mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  operationsPerformed: number = 0

  hideAllPopups: EventEmitter<null> = new EventEmitter()
  updateShifts: EventEmitter<Date> = new EventEmitter()

  constructor(
    private http: HttpClient
  ) { }

  getLoggedInEmployeeShifts(firstDay: Date = new Date(), days: number = 7): Observable<ShiftsDto> {
    let params = new HttpParams()
    .append('firstDay', moment(firstDay).format('DDMMyyyy'))
    .append('days', days+'')
    return this.http.get(`${environment.serverUrl}/shift/employee`, {params: params, withCredentials: true})
    .pipe(
      map((s: ShiftsDto) => {
        s.shifts = s.shifts.map(s => ShiftDto.copy(s)).sort((a, b) => a.start.getTime() - b.start.getTime())
        return s
      })
    ) as Observable<ShiftsDto>
  }

  getShiftsInWeekByPositionId(positionId: number, firstDay: Date = new Date()): Observable<ShiftsDto> {
    let params = new HttpParams()
    .append('positionId', positionId+'')
    .append('firstDay', moment(firstDay).format('DDMMyyyy'))
    return this.http.get(`${environment.serverUrl}/shift/week`, {params: params, withCredentials: true})
    .pipe(
      map((s: ShiftsDto) => {
        s.shifts = s.shifts.map(s => ShiftDto.copy(s)).sort((a, b) => a.start.getTime() - b.start.getTime())
        return s
      })
    ) as Observable<ShiftsDto>
  }

  saveShift(shift: ShiftDto): Observable<SavedShiftResponseDto> {
    return of(null)
    .pipe(
      tap(() => this.operationsPerformed++),
      mergeMap(() => this.http.post(`${environment.serverUrl}/shift`, shift.addTimeZoneToDates(), {withCredentials: true})),
      tap((s: SavedShiftResponseDto) => s.savedShift = ShiftDto.copy(s.savedShift)),
      tap(() => this.operationsPerformed--, () => this.operationsPerformed--)
    ) as Observable<SavedShiftResponseDto>
  }

  deleteShift(shiftId: number): Observable<ShiftDto> {
    return of(null)
    .pipe(
      tap(() => this.operationsPerformed++),
      mergeMap(() => this.http.delete(`${environment.serverUrl}/shift/${shiftId}`, {withCredentials: true})),
      map((s: ShiftDto) => ShiftDto.copy(s)),
      tap(() => this.operationsPerformed--, () => this.operationsPerformed--)
    ) as Observable<ShiftDto>
  }

}
