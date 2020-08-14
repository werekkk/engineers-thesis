import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PreferencesWeekDto } from 'src/app/app/model/dto/PreferencesWeekDto';
import { TimeStep } from 'src/app/app/model/TimeStep';
import { CanvasUtils } from 'src/app/app/shared/utils/canvas-utils';
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { DayOfWeekPipe } from 'src/app/app/pipes/day-of-week.pipe';
import { Utils } from 'src/app/app/shared/utils/utils';
import { PreferenceType } from 'src/app/app/model/PreferenceType';
import { PreferenceBlock } from './PreferenceBlock'
import { HourPreferenceDto } from 'src/app/app/model/dto/HourPreferenceDto';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';

type Canvas = CanvasUtils.Canvas

type BlockEdge = {
  x: number,
  day: number
}

export type PreferenceCreatedEvent = {
  preference: HourPreferenceDto,
  day: number
}

@Component({
  selector: 'preferences-week-editor',
  templateUrl: './preferences-week-editor.component.html',
  styleUrls: ['./preferences-week-editor.component.scss']
})
export class PreferencesWeekEditorComponent implements AfterViewInit {

  canvas: Canvas

  @ViewChild('canvas', {static: false})
  canvasElement: ElementRef<HTMLCanvasElement>
  
  @Input('timeStep')
  timeStep: TimeStep

  @Input('preferenceType')
  preferenceType: PreferenceType

  preferenceBlocks: PreferenceBlock[]

  _preferenceWeek: PreferencesWeekDto
  get preferenceWeek(): PreferencesWeekDto {
    return this._preferenceWeek
  }
  @Input('preferencesWeek')
  set preferenceWeek(val: PreferencesWeekDto) {
    this._preferenceWeek = val
    if (this.canvas) {
      this.mapPreferenceBlocks()
    }
  }
  @Output('preferencesWeekChange')
  preferencesWeekChange: EventEmitter<PreferencesWeekDto> = new EventEmitter()

  @Output('newPreferenceCreated')
  newPreferenceCreated: EventEmitter<PreferenceCreatedEvent> = new EventEmitter()

  highlightedDay: number = undefined
  highlightedHour: TimeDto = undefined

  labelFontSize: number = 12

  verticalPadding: number = 2
  horizontalPadding: number = 16
  yTranslate: number = this.verticalPadding
  dayNamesColumnWidth: number = 110
  rowHeight: number = 40
  highlightedHourLabelHeight: number = 20
  hourLinesStickOutSize: number = 3
  hourLabelsHeight: number = 20
  totalCanvasHeight: number = this.rowHeight * 7 + this.verticalPadding * 2 + this.hourLabelsHeight + this.highlightedHourLabelHeight

  createdBlockStart: BlockEdge
  createdBlockFinish: BlockEdge

  constructor() { }

  ngAfterViewInit(): void {
    this.adjustCanvasWidth()
    this.initCanvas()
  }

  adjustCanvasWidth() {
    this.canvasElement.nativeElement.style.width = '100%'
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
    this.mapPreferenceBlocks()
    this.requestRedraw()
  }

  mapPreferenceBlocks() {
    this.preferenceBlocks = PreferenceBlock.fromPreferencesWeek(
      this.preferenceWeek, 
      this.horizontalPadding + this.dayNamesColumnWidth,
      this.highlightedHourLabelHeight,
      this.canvas.width - this.dayNamesColumnWidth - this.horizontalPadding*2,
      7*this.rowHeight
    )
  }

  handleOnMouseMove(this: PreferencesWeekEditorComponent, ev: MouseEvent) {
    let redraw = false
    redraw = this.updateHighlightedDay(ev) || redraw
    redraw = this.updateHighlightedHour(ev) || redraw
    redraw = this.updateCreatedBlockFinish(ev) || redraw
    if (this.createdBlockStart) {
      let newEnd = this.getBlockEdge(ev)
      redraw = (!this.createdBlockFinish || this.createdBlockFinish.x != newEnd.x) || redraw
      this.createdBlockFinish = newEnd
    }
    if (redraw) {
      this.requestRedraw()
    }
  }
  
  updateHighlightedDay(ev: MouseEvent): boolean {
    return !this.createdBlockStart && Utils.assignAndCheckForChange(
      this.highlightedDay,
      this.getDayFromY(ev.offsetY),
      v => this.highlightedDay = v
    )
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
      this.getBlockEdge(ev),
      v => this.createdBlockFinish = v,
      (a, b) => b && a.x == b.x
    )
  }

  handleOnMouseLeave(this: PreferencesWeekEditorComponent, ev: MouseEvent) {
    this.highlightedDay = undefined
    this.highlightedHour = undefined
    this.createdBlockStart = undefined
    this.createdBlockFinish = undefined
    this.requestRedraw()
  }

  handleOnMouseDown(this: PreferencesWeekEditorComponent, ev: MouseEvent) {
    this.createdBlockStart = this.getBlockEdge(ev)
  }

  getBlockEdge(ev: MouseEvent): BlockEdge {
    return {x: this.getXFromTime(this.highlightedHour), day: this.highlightedDay }
  }

  handleOnMouseUp(this: PreferencesWeekEditorComponent, ev: MouseEvent) {
    if (this.createdBlockStart && this.createdBlockFinish) {
      this.createPreference()
    }
    this.createdBlockStart = undefined
    this.createdBlockFinish = undefined
    this.requestRedraw()
  }

  createPreference() {
    let newPreference: PreferenceCreatedEvent = {
      preference: new HourPreferenceDto(
        this.preferenceType, new TimePeriodDto(
          this.getTimeFromX(this.createdBlockStart.x),
          this.getTimeFromX(this.createdBlockFinish.x)
        )),
      day: this.createdBlockStart.day
    }
    this.newPreferenceCreated.emit(newPreference)
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
    this.drawHighlightedDay()
    this.drawPreferenceBlocks()
    this.drawRowLines()
    this.drawCreatedBlock()
    this.drawColumnLines()
    this.drawHourLabels()
    this.drawDayNames()
    this.drawHighlightedHourLine()
    this.drawHighlightedHourLabel()
  }

  drawHighlightedDay() {
    if (this.highlightedDay != undefined) {
      let ctx = this.canvas.context
      ctx.save()
      ctx.fillStyle = '#fcf7c5'
      ctx.fillRect(this.horizontalPadding, this.getYFromDay(this.highlightedDay), this.dayNamesColumnWidth, this.rowHeight)
      ctx.restore()
    }
  }

  drawPreferenceBlocks() {
    let ctx = this.canvas.context
    ctx.save()
    this.preferenceBlocks.forEach(b => {
      ctx.fillStyle = b.color
      ctx.fillRect(b.x1, b.y1, b.x2 - b.x1, b.y2 - b.y1)
    })
    ctx.restore()
  }

  drawRowLines() {
    let ctx = this.canvas.context
    for (let i = 0; i <= 7; i++) {
      let y = i*this.rowHeight + this.highlightedHourLabelHeight
      ctx.beginPath()
      ctx.moveTo(this.horizontalPadding, y)
      ctx.lineTo(this.canvas.width - this.horizontalPadding, y)
      ctx.stroke()
    }
  }

  drawCreatedBlock() {
    if (this.createdBlockStart && this.createdBlockFinish) {
      let ctx = this.canvas.context
      let y = this.getYFromDay(this.createdBlockStart.day)
      let color = PreferenceType.toColor(this.preferenceType)
      ctx.save()
      ctx.fillStyle = CanvasUtils.darkenColor(color, 8)
      ctx.fillRect(this.createdBlockStart.x, y, this.createdBlockFinish.x - this.createdBlockStart.x, this.rowHeight)
      ctx.strokeStyle = CanvasUtils.darkenColor(color, 20)
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(this.createdBlockStart.x, y)
      ctx.lineTo(this.createdBlockStart.x, y + this.rowHeight)
      ctx.lineTo(this.createdBlockFinish.x, y + this.rowHeight)
      ctx.lineTo(this.createdBlockFinish.x, y)
      ctx.lineTo(this.createdBlockStart.x, y)
      ctx.stroke()
      ctx.restore()
    }
  }

  drawColumnLines() {
    let ctx = this.canvas.context
    ctx.beginPath()
    ctx.moveTo(this.horizontalPadding, this.highlightedHourLabelHeight)
    ctx.lineTo(this.horizontalPadding, this.rowHeight*7 + this.highlightedHourLabelHeight)
    ctx.stroke()
    this.drawHourLines()
  }

  drawHourLines() {
    let ctx = this.canvas.context
    for (let i = 0; i <= 24; i++) {
      ctx.beginPath()
      let x = this.getXFromTime(new TimeDto(i, 0))
      ctx.moveTo(x, this.highlightedHourLabelHeight)
      ctx.lineTo(x, this.rowHeight*7 + this.hourLinesStickOutSize + this.highlightedHourLabelHeight)
      ctx.stroke()
    }
  }

  drawHourLabels() {
    let ctx = this.canvas.context
    ctx.save()
    this.setFont(ctx, '', 11)
    let y = this.getYFromDay(6) + this.rowHeight + this.hourLabelsHeight
    for (let i = 0; i <= 24; i++) {
      let x = this.getXFromTime(new TimeDto(i, 0))
      ctx.fillText(i+'', x, y)
    }
    ctx.restore()
  }

  drawDayNames() {
    let ctx = this.canvas.context
    let x = this.horizontalPadding + this.dayNamesColumnWidth/2
    ctx.save()
    ctx.textBaseline = 'middle'
    this.setFont(ctx, '', 16)
    for (let index = 0; index < DayOfWeekPipe.DAY_NAMES.length; index++) {
      const element = DayOfWeekPipe.DAY_NAMES[index];
      ctx.fillText(element, x, this.getYFromDay(index) + this.rowHeight/2, this.dayNamesColumnWidth)
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
      ctx.lineTo(x, this.highlightedHourLabelHeight + 7*this.rowHeight)
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

  /**
   * @param dayNumber Day number (monday: 0, tuesday: 1, ..., sunday: 6) 
   */
  getYFromDay(dayNumber: number) { 
    return dayNumber * this.rowHeight + this.highlightedHourLabelHeight
  }

  getDayFromY(y: number): number {
    let day = Math.floor((y - this.highlightedHourLabelHeight) / this.rowHeight)
    day = Utils.coerceIn(day, 0, 6)
    return day >= 0 && day <= 6 ? day : undefined
  }

  getXFromTime(time: TimeDto): number {
    let xMax = this.canvas.width - this.horizontalPadding*2 - this.dayNamesColumnWidth
    return this.horizontalPadding + this.dayNamesColumnWidth + time.toDayPercentage() * xMax
  }

  getTimeFromX(x: number): TimeDto {
    let percentage = (x - this.horizontalPadding - this.dayNamesColumnWidth) / (this.canvas.width - this.horizontalPadding*2 - this.dayNamesColumnWidth)
    percentage = Utils.coerceIn(percentage, 0, 1)
    return percentage >= 0 && percentage <= 1 ? TimeStep.toTimeDto(this.timeStep, percentage) : undefined
  }

}