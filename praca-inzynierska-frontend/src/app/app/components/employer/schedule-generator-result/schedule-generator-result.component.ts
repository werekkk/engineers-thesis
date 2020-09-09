import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShiftsDto } from 'src/app/app/model/dto/ShiftsDto';
import { Router } from '@angular/router';
import { GeneratorConfigDto } from 'src/app/app/model/dto/GeneratorConfigDto';
import { ScheduleGeneratorService } from 'src/app/app/services/schedule-generator.service';
import { ShiftDto } from 'src/app/app/model/dto/ShiftDto';
import { PositionDto } from 'src/app/app/model/dto/PositionDto';
import { Utils } from 'src/app/app/shared/utils/utils';
import { ShiftService } from 'src/app/app/services/shift.service';

export type GeneratorState = { config: GeneratorConfigDto }

@Component({
  selector: 'schedule-generator-result',
  templateUrl: './schedule-generator-result.component.html',
  styleUrls: ['./schedule-generator-result.component.scss']
})
export class ScheduleGeneratorResultComponent implements OnInit {

  config: GeneratorConfigDto

  firstDay: Date

  weekStart: Date

  scheduleGenerated: boolean = false

  generatedShifts: ShiftDto[] = []
  positions: PositionDto[] = []
  shiftsByPosition: ShiftDto[][] = []
  shiftsTablesByPosition: ShiftDto[][][][] = []

  savingShifts: boolean = false

  constructor(
    private router: Router,
    private scheduleGeneratorService: ScheduleGeneratorService,
    private shfitService: ShiftService
  ) { }

  ngOnInit(): void {
    let request: GeneratorState = window.history.state as GeneratorState
    if (request.config == null) {
      this.router.navigate([''])
    } else {
      this.config = GeneratorConfigDto.copyOf(request.config)
      this.weekStart = Utils.firstDayOfWeekFrom(this.config.firstDay)
      this.shiftsTablesByPosition = []
      this.config.positions.forEach(() => this.shiftsTablesByPosition.push([]))
      this.generateSchedule()
    }
  }

  private generateSchedule() {
    this.scheduleGenerated = false
    this.scheduleGeneratorService.generateSchedule(this.config).subscribe(shifts => {
      this.handleGeneratedShifts(shifts.shifts)
      this.scheduleGenerated = true
    })
  }

  private handleGeneratedShifts(shifts: ShiftDto[]) {
    this.shiftsByPosition = []
    this.config.positions.forEach(() => this.shiftsByPosition.push([]))

    this.positions = this.config.positions
    this.generatedShifts = shifts
    
    let positionMap = this.createPositionIdToIndexMap(this.positions)
    shifts.forEach(s => this.shiftsByPosition[positionMap[s.positionId]].push(s))
  }

  private createPositionIdToIndexMap(positions: PositionDto[]): Map<number, number> {
    let map = new Map()
    positions.forEach((p, i) => map[p.id] = i)
    return map
  }

  onBackPressed() {
    this.router.navigate(['employer', 'schedule-generator'])
  }

  onGeneratePressed() {
    this.generateSchedule()
  }

  onSavePressed() {
    this.savingShifts = true
    let shiftsToSave: ShiftDto[] = []
    this.shiftsTablesByPosition.forEach(s => s.forEach(s => s.forEach(s => s.forEach(s => shiftsToSave.push(s)))))
    this.shfitService.saveGeneratedShifts(shiftsToSave, this.config)
    .subscribe(() => {
      this.savingShifts = false
      this.router.navigate([''])
    })
  }
}
