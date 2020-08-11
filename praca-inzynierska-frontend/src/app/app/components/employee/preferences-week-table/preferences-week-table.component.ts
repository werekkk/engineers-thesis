import { Component, OnInit, Input } from '@angular/core';
import { PreferencesWeekDto } from 'src/app/app/model/dto/PreferencesWeekDto';

@Component({
  selector: 'preferences-week-table',
  templateUrl: './preferences-week-table.component.html',
  styleUrls: ['./preferences-week-table.component.scss']
})
export class PreferencesWeekTableComponent implements OnInit {

  @Input('preferencesWeek')
  preferencesWeek: PreferencesWeekDto 

  days: number[] = [0, 1, 2, 3, 4, 5, 6]

  constructor() { }

  ngOnInit(): void {
  }

}
