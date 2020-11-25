import { Component, OnInit, Input } from '@angular/core';
import { PreferencesDayDto } from 'src/app/app/model/dto/PreferencesDayDto';
import { HourPreferenceDto } from 'src/app/app/model/dto/HourPreferenceDto';
import { PreferenceType } from 'src/app/app/model/PreferenceType';

@Component({
  selector: 'preferences-week-table-column',
  templateUrl: './preferences-week-table-column.component.html',
  styleUrls: ['./preferences-week-table-column.component.scss']
})
export class PreferencesWeekTableColumnComponent implements OnInit {

  @Input()
  day: number

  @Input()
  preferencesDay: PreferencesDayDto

  constructor() { }

  ngOnInit(): void {
  }

  getTypeColor(preference: HourPreferenceDto): string {
    return PreferenceType.toColor(preference.type)
  }

}
