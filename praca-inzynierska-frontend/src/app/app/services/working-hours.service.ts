import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkingHoursBackendDto } from '../model/dto/backend/WorkingHoursBackendDto'
import { WorkingHoursDto } from '../model/dto/WorkingHoursDto'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkingHoursService {

  constructor(
    private http: HttpClient
  ) { }

  getWorkingHours(): Observable<WorkingHoursDto> {
    return this.http.get(
      `${environment.serverUrl}/working-hours`, {withCredentials: true}
    ).pipe(
      map((backendDto: WorkingHoursBackendDto) => new WorkingHoursDto(backendDto))
    )
  }

  saveWorkingHours(workingHours: WorkingHoursDto): Observable<WorkingHoursDto> {
    let backendFormat = WorkingHoursBackendDto.of(workingHours)
    return this.http.post(
      `${environment.serverUrl}/working-hours`, backendFormat, {withCredentials: true}
    ).pipe(
      map((backendDto: WorkingHoursBackendDto) => new WorkingHoursDto(backendDto))
    )
  }

}
