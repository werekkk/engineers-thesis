import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { StatisticsYearDto } from '../model/dto/StatisticsYearDto';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    private http: HttpClient
  ) {}

  getYearStatistics(year: number): Observable<StatisticsYearDto> {
    return this.http.get(`${environment.serverUrl}/statistics/${year}`, {withCredentials: true})
    .pipe(
      map((sy: StatisticsYearDto) => StatisticsYearDto.copyOf(sy))
    )
  }

}
