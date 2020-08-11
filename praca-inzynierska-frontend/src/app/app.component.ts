import { Component, Input } from '@angular/core';
import { TimeDto } from './app/model/dto/TimeDto';
import { TimePeriodDto } from './app/model/dto/TimePeriodDto';
import { RequiredStaffTimePeriodDto } from './app/model/dto/RequiredStaffTimePeriodDto';
import { Utils } from './app/shared/utils';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'praca-inzynierska-frontend';
}
