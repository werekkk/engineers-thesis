import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'preferences-one-time',
  templateUrl: './preferences-one-time.component.html',
  styleUrls: ['./preferences-one-time.component.scss']
})
export class PreferencesOneTimeComponent implements OnInit {

  
  monthDate: Date = new Date()

  _month: Moment = moment().locale('pl')
  get month(): Moment {
    return this._month
  }
  set month(val: Moment) {
    this._month = val
    this.monthDate = val.toDate()
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
