import { Component, OnInit } from '@angular/core';
import { HourPreferenceService } from '../../../services/hour-preference.service'

@Component({
  selector: 'preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
