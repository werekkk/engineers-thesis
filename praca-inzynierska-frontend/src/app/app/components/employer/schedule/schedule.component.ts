import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PositionService } from 'src/app/app/services/position.service';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import * as moment from 'moment';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  positions: PositionDto[]
  positionsLoaded = false

  firstDate: Date = moment().startOf('isoWeek').toDate()

  constructor(
    private positionService: PositionService,
    private router: Router
  ) { 
    positionService.positions.subscribe(newPositions => {
      this.positions = newPositions
    })
  }

  ngOnInit(): void {
    if (!this.positionService.positionsLoaded) {
      this.positionService.getAllPositions().subscribe(() => {
        this.positionsLoaded = true
      })
    } else {
      this.positionsLoaded = true
    }
  }

  onGenerateScheduleClicked() {
    this.router.navigate(['employer', 'schedule', 'generator'])
  }

}
