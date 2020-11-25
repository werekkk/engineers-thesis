import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TimeStep } from 'src/app/app/model/TimeStep';
import { PreferenceType } from 'src/app/app/model/PreferenceType';
import { PreferencesWeekDto } from 'src/app/app/model/dto/PreferencesWeekDto';
import { CanvasUtils } from 'src/app/app/shared/utils/canvas-utils';
import { Utils } from 'src/app/app/shared/utils/utils';
import { PreferenceCreatedEvent } from '../preferences-week-editor/preferences-week-editor.component';
import { HourPreferenceDto } from 'src/app/app/model/dto/HourPreferenceDto';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { OneTimeHourPreferenceDto } from 'src/app/app/model/dto/OneTimeHourPreferenceDto';
import { PreferenceBlock } from '../preferences-week-editor/PreferenceBlock';
import * as moment from 'moment';
import { interval } from 'rxjs';

type Canvas = CanvasUtils.Canvas

@Component({
  selector: 'preferences-one-time-day-editor',
  templateUrl: './preferences-one-time-day-editor.component.html',
  styleUrls: ['./preferences-one-time-day-editor.component.scss']
})
export class PreferencesOneTimeDayEditorComponent implements AfterViewInit {

  @Input()
  day: Date

  @Input()
  timeStep: TimeStep

  @Input()
  preferenceType: PreferenceType

  @Input()
  preferencesWeek: PreferencesWeekDto
  preferenceWeekBlocks: PreferenceBlock[] = []

  _oneTimePreferences: OneTimeHourPreferenceDto[]
  get oneTimePreferences(): OneTimeHourPreferenceDto[] {
    return this._oneTimePreferences
  }
  @Input()
  set oneTimePreferences(val: OneTimeHourPreferenceDto[]) {
    if (this.canvas) {
      this.mapOneTimePreferenceBlocks()
      this.requestRedraw()
    }
    this._oneTimePreferences = val
  }
  preferenceOneTimeBlocks: PreferenceBlock[] = []

  @Output()
  onPreferenceCreated: EventEmitter<OneTimeHourPreferenceDto> = new EventEmitter()

  canvas: Canvas
  @ViewChild('canvas', {static: false})
  canvasElement: ElementRef<HTMLCanvasElement>
  
  @ViewChild('parent', {static: false})
  parentDiv: ElementRef<HTMLDivElement>

  highlightedHour: TimeDto = undefined

  labelFontSize: number = 18

  yTranslate: number = 2
  highlightedHourLabelHeight: number = 20
  hourLinesStickOutSize: number = 3
  rowHeight: number = 50
  hourLabelsHeight: number = 20
  totalCanvasHeight: number = this.yTranslate + this.highlightedHourLabelHeight + this.rowHeight + this.hourLabelsHeight

  horizontalPadding: number = 20

  createdBlockStart: number
  createdBlockFinish: number

  initialWidth: number = undefined

  constructor() {
  }

  ngAfterViewInit(): void {
    window.requestAnimationFrame(() => {
      this.adjustCanvasWidth()
      this.initCanvas()
    })
  }

  adjustCanvasWidth() {
    this.canvasElement.nativeElement.style.width = 'inherit'
    this.canvasElement.nativeElement.width = this.canvasElement.nativeElement.offsetWidth
  }

  initCanvas() {
    let hiDpiCanvas = CanvasUtils.createHiDPICanvas(this.canvasElement.nativeElement.width, this.totalCanvasHeight)
    if (!this.canvas) {
      this.canvasElement.nativeElement.replaceWith(hiDpiCanvas)
    } else {
      this.canvas.canvas.replaceWith(hiDpiCanvas)
    }
    this.canvas = new CanvasUtils.Canvas(hiDpiCanvas)
    this.canvas.context.translate(0, this.yTranslate)
    this.canvas.context.lineWidth = 1
    this.canvas.context.strokeStyle = '#AAA'
    this.canvas.canvas.addEventListener('mousemove', (ev) => this.handleOnMouseMove(ev))
    this.canvas.canvas.addEventListener('mouseleave', (ev) => this.handleOnMouseLeave(ev))
    this.canvas.canvas.addEventListener('mousedown', (ev) => this.handleOnMouseDown(ev))
    this.canvas.canvas.addEventListener('mouseup', (ev) => this.handleOnMouseUp(ev))
    this.mapWeekPreferenceBlocks()
    this.mapOneTimePreferenceBlocks()
    this.requestRedraw()
  }

  mapWeekPreferenceBlocks() {
    this.preferenceWeekBlocks = PreferenceBlock.fromPreferencesDay(
      this.preferencesWeek.getDay(moment(this.day).isoWeekday() - 1), 
      this.horizontalPadding,
      this.canvas.width - 2*this.horizontalPadding,
      this.highlightedHourLabelHeight,
      this.highlightedHourLabelHeight + this.rowHeight
    )
  }

  mapOneTimePreferenceBlocks() {
    this.preferenceOneTimeBlocks = this.oneTimePreferences.map(p => 
      PreferenceBlock.fromOneTimePreference(
        p,
        this.horizontalPadding,
        this.canvas.width - 2*this.horizontalPadding,
        this.highlightedHourLabelHeight,
        this.highlightedHourLabelHeight + this.rowHeight
      )
    )
  }

  handleOnMouseMove(this: PreferencesOneTimeDayEditorComponent, ev: MouseEvent) {
    let redraw = false
    redraw = this.updateHighlightedHour(ev) || redraw
    redraw = this.updateCreatedBlockFinish(ev) || redraw
    if (this.createdBlockStart) {
      let newEnd = this.getXFromTime(this.highlightedHour)
      redraw = (!this.createdBlockFinish || this.createdBlockFinish != newEnd) || redraw
      this.createdBlockFinish = newEnd
    }
    if (redraw) {
      this.requestRedraw()
    }
  }
  
  updateHighlightedHour(ev: MouseEvent): boolean {
    return Utils.assignAndCheckForChange(
      this.highlightedHour,
      this.getTimeFromX(ev.offsetX),
      v => this.highlightedHour = v,
      (a, b) => a.equals(b)
    )
  }

  updateCreatedBlockFinish(ev: MouseEvent): boolean {
    return this.createdBlockStart && Utils.assignAndCheckForChange(
      this.createdBlockFinish,
      this.getXFromTime(this.highlightedHour),
      v => this.createdBlockFinish = v
    )
  }

  handleOnMouseLeave(this: PreferencesOneTimeDayEditorComponent, ev: MouseEvent) {
    this.highlightedHour = undefined
    this.createdBlockStart = undefined
    this.createdBlockFinish = undefined
    this.requestRedraw()
  }

  handleOnMouseDown(this: PreferencesOneTimeDayEditorComponent, ev: MouseEvent) {
    if (this.highlightedHour) {
      this.createdBlockStart = this.getXFromTime(this.highlightedHour)
    }
  }

  handleOnMouseUp(this: PreferencesOneTimeDayEditorComponent, ev: MouseEvent) {
    if (this.createdBlockStart && this.createdBlockFinish) {
      this.createPreference()
    }
    this.createdBlockStart = undefined
    this.createdBlockFinish = undefined
    this.requestRedraw()
  }

  createPreference() {
    if (this.createdBlockStart != this.createdBlockFinish) {
      let start: TimeDto = null
      let finish: TimeDto = null
      if (this.createdBlockStart < this.createdBlockFinish) {
        start = this.getTimeFromX(this.createdBlockStart)
        finish = this.getTimeFromX(this.createdBlockFinish)
      } else if (this.createdBlockStart > this.createdBlockFinish) {
        start = this.getTimeFromX(this.createdBlockFinish)
        finish = this.getTimeFromX(this.createdBlockStart)
      }
      let newPreference = new OneTimeHourPreferenceDto(
        0, 
        this.preferenceType, 
        start.createDateTime(this.day),
        finish.createDateTime(this.day)
        )
      this.onPreferenceCreated.emit(newPreference)
    }
    
  }

  requestRedraw() {
    window.requestAnimationFrame(() => this.redraw())
  }

  redraw() {
    this.clear()
    this.draw()
  }

  clear() {
    this.canvas.context.translate(0, -this.yTranslate)
    this.canvas.context.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height)
    this.canvas.context.translate(0, this.yTranslate)
  }

  draw() {
    this.drawPreferenceBlocks()
    this.drawRowLines()
    this.drawCreatedBlock()
    this.drawColumnLines()
    this.drawHourLabels()
    this.drawHighlightedHourLine()
    this.drawHighlightedHourLabel()
  }

  drawPreferenceBlocks() {
    let ctx = this.canvas.context
    ctx.save()
    this.preferenceWeekBlocks.forEach(b => {
      ctx.fillStyle = b.color
      ctx.fillRect(b.x1, b.y1, b.x2 - b.x1, b.y2 - b.y1)
    })
    this.preferenceOneTimeBlocks.forEach(b => {
      ctx.fillStyle = b.color
      ctx.fillRect(b.x1, b.y1, b.x2 - b.x1, b.y2 - b.y1)
    })
    ctx.restore()
  }

  drawRowLines() {
    let ctx = this.canvas.context
    for (let y of [this.highlightedHourLabelHeight, this.highlightedHourLabelHeight + this.rowHeight]) {
      ctx.beginPath()
      ctx.moveTo(this.horizontalPadding, y)
      ctx.lineTo(this.canvas.width - this.horizontalPadding, y)
      ctx.stroke()
    }
  }

  drawCreatedBlock() {
    if (this.createdBlockStart && this.createdBlockFinish) {
      let ctx = this.canvas.context
      let y = this.highlightedHourLabelHeight
      let color = PreferenceType.toColor(this.preferenceType)
      ctx.save()
      ctx.fillStyle = CanvasUtils.darkenColor(color, 8)
      ctx.fillRect(this.createdBlockStart, y, this.createdBlockFinish - this.createdBlockStart, this.rowHeight)
      ctx.strokeStyle = CanvasUtils.darkenColor(color, 20)
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(this.createdBlockStart, y)
      ctx.lineTo(this.createdBlockStart, y + this.rowHeight)
      ctx.lineTo(this.createdBlockFinish, y + this.rowHeight)
      ctx.lineTo(this.createdBlockFinish, y)
      ctx.lineTo(this.createdBlockStart, y)
      ctx.stroke()
      ctx.restore()
    }
  }

  drawColumnLines() {
    let ctx = this.canvas.context
    for (let i = 0; i <= 24; i++) {
      ctx.beginPath()
      let x = this.getXFromTime(new TimeDto(i, 0))
      ctx.moveTo(x, this.highlightedHourLabelHeight)
      ctx.lineTo(x, this.highlightedHourLabelHeight + this.rowHeight + this.hourLinesStickOutSize)
      ctx.stroke()
    }
  }

  drawHourLabels() {
    let ctx = this.canvas.context
    ctx.save()
    this.setFont(ctx, '', 11)
    let y = this.rowHeight + this.hourLabelsHeight + this.highlightedHourLabelHeight
    for (let i = 0; i <= 24; i++) {
      let x = this.getXFromTime(new TimeDto(i, 0))
      ctx.fillText(i+'', x, y)
    }
    ctx.restore()
  }

  drawHighlightedHourLine() {
    if (this.highlightedHour) {
      let ctx = this.canvas.context
      let x = this.getXFromTime(this.highlightedHour)
      ctx.save()
      ctx.strokeStyle = '#F00'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, this.highlightedHourLabelHeight)
      ctx.lineTo(x, this.highlightedHourLabelHeight + this.rowHeight)
      ctx.stroke()
      ctx.restore()
    }
  }

  drawHighlightedHourLabel() {
    if (this.highlightedHour) {
      let ctx = this.canvas.context
      let x = this.getXFromTime(this.highlightedHour)
      ctx.save()
      ctx.fillStyle = '#F00'
      this.setFont(ctx, 'bold', 12)
      ctx.fillText(this.highlightedHour.toHHMMString(), x, this.highlightedHourLabelHeight - 4)
      ctx.restore()
    }
  }

  setFont(context: CanvasRenderingContext2D, style: string = '', fontSize: number = null) {
    context.font = `${style} ${fontSize ? fontSize : this.labelFontSize}px Helvetica`
    context.textAlign = 'center'
  }

  getXFromTime(time: TimeDto): number {
    let xMax = this.canvas.width - this.horizontalPadding*2
    return this.horizontalPadding + time.toDayPercentage() * xMax
  }

  getTimeFromX(x: number): TimeDto {
    let percentage = (x - this.horizontalPadding) / (this.canvas.width - this.horizontalPadding*2)
    percentage = Utils.coerceIn(percentage, 0, 1)
    return percentage >= 0 && percentage <= 1 ? TimeStep.toTimeDto(this.timeStep, percentage) : undefined
  }

}
