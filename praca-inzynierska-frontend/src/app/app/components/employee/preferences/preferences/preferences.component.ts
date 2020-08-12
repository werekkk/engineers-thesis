import { Component, OnInit } from '@angular/core';
import { HourPreferenceService } from '../../../../services/hour-preference.service'
import { Router } from '@angular/router';

@Component({
  selector: 'preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onWeekPreferencesClicked() {
    this.router.navigate(['employee', 'preferences', 'week'])
  }

  onOneTimePreferencesClicked() {
    this.router.navigate(['employee', 'preferences', 'one-time'])
  }

}
