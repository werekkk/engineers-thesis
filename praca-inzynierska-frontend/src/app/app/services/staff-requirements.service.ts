import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { RequiredStaffDto } from '../model/dto/RequiredStaffDto'
import { RequiredStaffBackendDto } from '../model/dto/RequiredStaffBackendDto';

@Injectable({
  providedIn: 'root'
})
export class StaffRequirementsService {

  constructor(
    private http: HttpClient
  ) { }

  getPositionRequirements(positionId: number): Observable<RequiredStaffDto> {
    return this.http.get(`${environment.serverUrl}/staff-requirements/position/${positionId}`, {withCredentials: true})
    .pipe(
      map((rs: RequiredStaffBackendDto) => RequiredStaffDto.of(rs))
    )
  }

  savePositionRequirements(positionId: number, rs: RequiredStaffDto): Observable<RequiredStaffDto> {
    let backendFormat = RequiredStaffBackendDto.of(rs)
    return this.http.post(`${environment.serverUrl}/staff-requirements/position/${positionId}`,
    backendFormat, {withCredentials: true})
    .pipe(
      map((rs: RequiredStaffBackendDto) => RequiredStaffDto.of(rs))
    )
  }
}
