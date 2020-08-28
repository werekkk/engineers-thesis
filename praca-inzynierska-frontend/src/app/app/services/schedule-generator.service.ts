import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { PositionDto } from '../model/dto/PositionDto';
import { EmployeeDto } from '../model/dto/EmployeeDto';
import { GeneratorConfigDto } from '../model/dto/GeneratorConfigDto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShiftsDto } from '../model/dto/ShiftsDto';
import { map } from 'rxjs/operators';
import { ShiftDto } from '../model/dto/ShiftDto';

@Injectable({
  providedIn: 'root'
})
export class ScheduleGeneratorService {

  constructor(
    private http: HttpClient
  ) { }

  generateSchedule(config: GeneratorConfigDto): Observable<ShiftsDto> {
    return this.http.post(`${environment.serverUrl}/schedule-generator`, config, {withCredentials: true})
    .pipe(
      map((s: ShiftsDto) => {
        s.shifts = s.shifts.map(s => ShiftDto.copy(s)).sort((a, b) => a.start.getTime() - b.start.getTime())
        return s
      })
    ) as Observable<ShiftsDto>
  }

}
