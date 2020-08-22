import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShiftsDto } from 'src/app/app/model/dto/ShiftsDto';
import { Router } from '@angular/router';
import { GeneratorConfigDto } from 'src/app/app/model/dto/GeneratorConfigDto';
import { ScheduleGeneratorService } from 'src/app/app/services/schedule-generator.service';

export type GeneratorState = { config: GeneratorConfigDto }

@Component({
  selector: 'schedule-generator-result',
  templateUrl: './schedule-generator-result.component.html',
  styleUrls: ['./schedule-generator-result.component.scss']
})
export class ScheduleGeneratorResultComponent implements OnInit {

  scheduleGenerated: boolean = false

  constructor(
    private router: Router,
    private scheduleGeneratorService: ScheduleGeneratorService
  ) { }

  ngOnInit(): void {
    let request: GeneratorState = window.history.state as GeneratorState
    if (request.config == null) {
      this.router.navigate([''])
    } else {
      this.scheduleGenerated = false
      this.scheduleGeneratorService.generateSchedule(request.config).subscribe(shifts => {
        console.log(shifts);
        this.scheduleGenerated = true
      })
    }
  }

}
