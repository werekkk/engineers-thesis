import { Component, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { RequiredStaffTimePeriodDto } from '../../../model/dto/RequiredStaffTimePeriodDto'
import { TimeStep } from '../../../model/TimeStep'
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { timer, interval } from 'rxjs';
import { CanvasUtils } from 'src/app/app/shared/utils/canvas-utils';

type Canvas = CanvasUtils.Canvas

@Component({
  selector: 'staff-requirements-day-editor',
  templateUrl: './staff-requirements-day-editor.component.html',
  styleUrls: ['./staff-requirements-day-editor.component.scss']
})
export class StaffRequirementsDayEditorComponent implements AfterViewInit {


  @Input('timeStep')
  timeStep: TimeStep = TimeStep.FIFTEEN_MINUTES

  @Input('timePeriods')
  set timePeriods(value: RequiredStaffTimePeriodDto[]) {
    this._timePeriods = value
    this.adjustMaxEmployeesByTimePeriods()
    this.requestRedraw()
  }
  get timePeriods(): RequiredStaffTimePeriodDto[] {
    return this._timePeriods
  }

  _timePeriods: RequiredStaffTimePeriodDto[] = []

  @Output('timePeriodsChange')
  timePeriodsChange: EventEmitter<RequiredStaffTimePeriodDto[]> = new EventEmitter()

  @Input('highlightedPeriodIndex')
  set highlightedPeriodIndex(value: number) {
    this._highlightedPeriodIndex = value
    this.requestRedraw()
  }

  get highlightedPeriodIndex(): number {
    return this._highlightedPeriodIndex
  }  

  _highlightedPeriodIndex = undefined

  @ViewChild('canvas', {static: false})
  canvasElement: ElementRef<HTMLCanvasElement>
  canvasContext: CanvasRenderingContext2D

  canvas: Canvas
  yTranslate = 25

  highlightedEmployeeCount = 0
  highlightedHour: TimeDto = null

  minMaxEmployees = 5
  maxMaxEmployees = 20

  _maxEmployees = this.minMaxEmployees
  set maxEmployees(value: number) {
    if (value != this._maxEmployees && value >= this.minMaxEmployees && value <= this.maxMaxEmployees) {
      this._maxEmployees = value
      this.gridHeight = this.maxEmployees * this.employeeLineHeight
      if (this.canvas) {
        this.initCanvas()
      }
    }
  }
  get maxEmployees(): number {
    return this._maxEmployees
  }

  adjustMaxEmployeesByTimePeriods() {
    let newMaxEmployees = this.timePeriods.length > 0 ? this.timePeriods.map(tp => tp.employeeCount).reduceRight((prev, cur) => prev > cur ? prev : cur) : 0
    this.maxEmployees = newMaxEmployees > this.minMaxEmployees ? newMaxEmployees : this.minMaxEmployees
  }

  _employeeLineHeight = 20
  set employeeLineHeight(value: number) {
    this._employeeLineHeight = value
    this.gridHeight = this.maxEmployees * this.employeeLineHeight
  }
  get employeeLineHeight(): number {
    return this._employeeLineHeight
  }

  get totalCanvasHeight(): number {
    return this.yTranslate + this.gridHeight + this.valueLabelHeight + this.labelFontSize
  }

  gridHeight = this.maxEmployees * this.employeeLineHeight
  gridPadding = 30
  gridLeftPadding = 80
  gridStickOutSize = 3
  valueLabelHeight = 15
  labelFontSize = 13

  mouseMoveChange = false

  createdBlockStart: Position = null
  createdBlockFinish: Position = null

  constructor() { }

  ngAfterViewInit() {
    this.adjustCanvasWidth()
    this.initCanvas()
    // interval(1000).subscribe(() => console.log(this.latestMove, this.latestMove?.offsetY))
  }

  adjustCanvasWidth() {
    this.canvasElement.nativeElement.style.width = "100%"
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
    this.canvas.context.lineWidth = 0.5
    this.canvas.context.strokeStyle = '#AAA'
    this.canvas.canvas.addEventListener('mousemove', (ev) => this.handleOnMouseMove(ev))
    this.canvas.canvas.addEventListener('mouseleave', (ev) => this.handleOnMouseLeave(ev))
    this.canvas.canvas.addEventListener('mousedown', (ev) => this.handleOnMouseDown(ev))
    this.canvas.canvas.addEventListener('mouseup', (ev) => this.handleOnMouseUp(ev))
    this.requestRedraw()
  }

  requestRedraw() {
    window.requestAnimationFrame(() => this.redrawCanvas(this.canvas))
  }

  redrawCanvas(canvas: Canvas) {
    this.clearCanvas(canvas)
    this.draw(this.canvas)
  }

  clearCanvas(canvas: Canvas) {
    canvas.context.translate(0, -this.yTranslate)
    canvas.context.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height)
    canvas.context.translate(0, this.yTranslate)
  }

  latestMove: MouseEvent = undefined
  handleOnMouseMove(ev: MouseEvent) {
    this.latestMove = ev
    this.mouseMoveChange = false
    this.setHighlightedEmployeeCount(ev.offsetY)
    this.setHighlightedHour(ev.offsetX, ev.offsetY)
    if (this.createdBlockStart) {
      if (this.isAboveHighestEmployeeCountLine()) {
        this.startIncreasingMaxEmployees()
      }
      this.createdBlockStart.y = this.getYFromEmployeeCount(Math.min(this.highlightedEmployeeCount, this.maxEmployees))
      this.updateCreatedBlockFinish(ev)
    }
    if (this.mouseMoveChange) {
      this.requestRedraw()
    }
  }

  increasingTimer = undefined
  
  startIncreasingMaxEmployees() {
    if (!this.increasingTimer) {
      this.increasingTimer = timer(0, 200).subscribe(() => {
        if (this.createdBlockStart && this.isAboveHighestEmployeeCountLine() && this.maxEmployees < this.maxMaxEmployees) {
          this.maxEmployees++
        } else {
          this.increasingTimer.unsubscribe()
          this.increasingTimer = undefined
        }
      })
    }
  }

  isAboveHighestEmployeeCountLine(): boolean {
    let y: number
    if (this.canvas.canvas.offsetTop > this.latestMove['layerY']) { 
      y = this.latestMove['layerY']                                   // Firefox
    } else {
      y = this.latestMove['layerY'] - this.canvas.canvas.offsetTop    // Chrome
    }
    return this.getEmployeeCountFromY(y) > this.maxEmployees
  }

  updateCreatedBlockFinish(ev: MouseEvent) {
    let newCreatedBlockFinish = {
      x: this.getXFromTime(this.getTimeFromX(ev.offsetX), this.canvas),
      y: 0
    }
    if (!this.createdBlockFinish || this.createdBlockFinish.x != newCreatedBlockFinish.x) {
      this.createdBlockFinish = newCreatedBlockFinish
      this.mouseMoveChange = true
    }
  }

  setHighlightedEmployeeCount(y: number) {
    let newHighlightedEmployee = this.getEmployeeCountFromY(y)
    if (newHighlightedEmployee != this.highlightedEmployeeCount) {
      this.highlightedEmployeeCount = newHighlightedEmployee
      this.mouseMoveChange = true
    }
  }

  setHighlightedHour(x: number, y: number) {
    if (x >= this.gridLeftPadding && x <= this.canvas.width - this.gridPadding) {
      let newHighlightedHour = this.getTimeFromX(x)
      if (!newHighlightedHour.equals(this.highlightedHour)) {
        this.highlightedHour = newHighlightedHour
        this.mouseMoveChange = true
      }
    }
  }

  handleOnMouseLeave(this: StaffRequirementsDayEditorComponent, ev: MouseEvent) {
    this.highlightedEmployeeCount = undefined
    this.highlightedHour = undefined
    this.createdBlockStart = null
    this.createdBlockFinish = null
    this.adjustMaxEmployeesByTimePeriods()
    this.requestRedraw()
  }

  handleOnMouseDown(this: StaffRequirementsDayEditorComponent, ev: MouseEvent) {
      let newCreatedBlockStart = {
        x: this.getXFromTime(this.highlightedHour, this.canvas), 
        y: this.getYFromEmployeeCount(this.highlightedEmployeeCount)
      }
      this.createdBlockStart = newCreatedBlockStart
  }

  handleOnMouseUp(this: StaffRequirementsDayEditorComponent, ev: MouseEvent) {
    if (this.createdBlockStart && this.createdBlockFinish) {
      this.createRequirement(this.createdBlockStart, this.createdBlockFinish)
      this.requestRedraw()
    }
    this.createdBlockStart = null
    this.createdBlockFinish = null
    this.adjustMaxEmployeesByTimePeriods()
  }

  createRequirement(start: Position, finish: Position) {
    if (start.x != finish.x) {
      if (finish.x < start.x) {
        let temp = finish.x
        finish.x = start.x
        start.x = temp
      }
      let period = new TimePeriodDto(this.getTimeFromX(start.x), this.getTimeFromX(finish.x))
      let employeeCount = this.getEmployeeCountFromY(start.y, false)
      if (employeeCount != undefined) {
        let requirement = new RequiredStaffTimePeriodDto(0, this.getEmployeeCountFromY(start.y, false), period)
        let newRequirements = this._timePeriods.concat([requirement])
        this.timePeriodsChange.emit(newRequirements)
      }
    }
  }

  draw(canvas: Canvas) {
    this.drawPeriodBlocks(canvas)

    this.drawCreatedPeriodBlock(canvas)
    this.drawHighlightedPeriodBlock(canvas)

    this.drawHourLines(canvas)
    this.drawHourLabel(canvas)
    this.drawHourValueLabels(canvas)
    
    this.drawEmployeeLines(canvas)
    this.drawEmployeeCountLabel(canvas)
    this.drawEmployeeValueLabels(canvas)

    this.drawHighlightedHourLine(canvas)
    this.drawHighlightedHour(canvas)
  }
  
  drawPeriodBlocks(canvas: Canvas) {
    let ctx = canvas.context
    ctx.save()
    ctx.fillStyle = '#a0deb0'
    this.timePeriods.forEach((period, i) => {
      let rect = this.getRectFromPeriod(period, canvas)
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
    });
    ctx.restore()
  }

  drawHighlightedPeriodBlock(canvas: Canvas) {
    if (this.highlightedPeriodIndex != undefined) {
      let period = this.timePeriods[this.highlightedPeriodIndex]
      let rect = this.getRectFromPeriod(period, canvas)
      let ctx = canvas.context
      ctx.save()
      ctx.beginPath()
      ctx.fillStyle = '#92e62c'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1
      ctx.rect(rect.x, rect.y, rect.w, rect.h)
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
      ctx.stroke()
      ctx.restore()
    }
  }

  drawCreatedPeriodBlock(canvas: Canvas) {
    if (this.createdBlockStart && this.createdBlockFinish) {
      let isDeleting = this.highlightedEmployeeCount == 0
      let ctx = canvas.context
      ctx.save()
      ctx.fillStyle = isDeleting ? '#f75a4f' : '#ebe534'
      let x = this.createdBlockStart.x
      let y = isDeleting ? 0 : this.createdBlockStart.y
      ctx.fillRect(x, y, this.createdBlockFinish.x - x, this.gridHeight - y)
      ctx.restore()
    }
  }

  drawHourLines(canvas: Canvas) {
    let ctx = canvas.context
    for (let i = 0; i <= 24; i++) {
      let x = this.getXFromTime(new TimeDto(i, 0), canvas)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.gridHeight + this.gridStickOutSize)
      ctx.stroke()
    }
  }

  drawHighlightedHourLine(canvas: Canvas) {
    if (this.highlightedHour) {
      let ctx = canvas.context
      let x = this.getXFromTime(this.highlightedHour, canvas)
      ctx.save()
      ctx.strokeStyle = '#F00'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.gridHeight)
      ctx.stroke()
      ctx.restore()
    }
  }

  drawHighlightedHour(canvas: Canvas) {
    if (this.highlightedHour) {
      let ctx = canvas.context
      let x = this.getXFromTime(this.highlightedHour, canvas)
      ctx.save()
      this.setLabelFont(ctx, 'bold', 10)
      ctx.fillStyle = '#F00'
      ctx.fillText(this.highlightedHour.toHHMMString(), x, -5)
      ctx.restore()
    }
  }

  drawHourLabel(canvas: Canvas) {
    let ctx = canvas.context
    this.setLabelFont(ctx)
    ctx.fillText('Godzina', this.getXFromTime(new TimeDto(12, 0), canvas), this.gridHeight + this.valueLabelHeight + this.labelFontSize)
  }

  drawHourValueLabels(canvas: Canvas) {
    let ctx = canvas.context
    this.setLabelFont(ctx)
    for (let i = 0; i <= 24; i++) {
      ctx.fillText(i+'', this.getXFromTime(new TimeDto(i, 0), canvas), this.gridHeight + this.valueLabelHeight)
    }
  }

  drawEmployeeLines(canvas: Canvas) {
    let ctx = canvas.context
    let width = canvas.width
    for (let i = 0; i <= this.maxEmployees; i++) {
      let heigth = this.getYFromEmployeeCount(i)
      let drawingHighlighted = i == this.highlightedEmployeeCount
      if (drawingHighlighted) {
        ctx.save()
        ctx.lineWidth = 1
        ctx.strokeStyle = '#000'
      }
      ctx.beginPath()
      ctx.moveTo(this.gridLeftPadding - this.gridStickOutSize, heigth)
      ctx.lineTo(width - this.gridPadding, heigth)
      ctx.stroke()
      if (drawingHighlighted) {
        ctx.restore()
      }
    }
  }

  drawEmployeeCountLabel(canvas: Canvas) {
    let ctx = canvas.context
    this.setLabelFont(ctx)
    ctx.save()
    ctx.translate(this.gridLeftPadding, this.gridHeight / 2)
    ctx.rotate(270 * Math.PI / 180)
    ctx.fillText('Liczba', 0, -this.valueLabelHeight - this.labelFontSize * 2)
    ctx.fillText('pracowników', 0, -this.valueLabelHeight - this.labelFontSize)
    ctx.restore()
  }

  drawEmployeeValueLabels(canvas: Canvas) {
    let ctx = canvas.context
    ctx.save()
    ctx.textBaseline = 'middle'
    this.setLabelFont(ctx)
    for (let i = 0; i <= this.maxEmployees; i++) {
      if (i == this.highlightedEmployeeCount) {
        this.setLabelFont(ctx, 'bold', 17)
        ctx.fillText(i+'', this.gridLeftPadding - (this.valueLabelHeight / 2) - this.gridStickOutSize, this.getYFromEmployeeCount(i))
        this.setLabelFont(ctx)
      } else {
        ctx.fillText(i+'', this.gridLeftPadding - (this.valueLabelHeight / 2) - this.gridStickOutSize, this.getYFromEmployeeCount(i))
      }
    }
    ctx.restore()
  }

  getRectFromPeriod(period: RequiredStaffTimePeriodDto, canvas: Canvas): Rect {
    let x1 = this.getXFromTime(period.timePeriod.start, canvas)
    let x2 = this.getXFromTime(period.timePeriod.finish, canvas)
    let y1 = this.getYFromEmployeeCount(period.employeeCount)
    let y2 = this.getYFromEmployeeCount(0)
    return {x: x1, y: y1, w: (x2 - x1), h: (y2 - y1)}
  }

  setLabelFont(context: CanvasRenderingContext2D, style: string = '', fontSize: number = null) {
    context.font = `${style} ${fontSize ? fontSize: this.labelFontSize}px "Segoe UI"`
    context.textAlign = 'center'
  }

  getXFromTime(time: TimeDto, canvas: Canvas) {
    let w = canvas.width
    let x = this.gridLeftPadding + (w - this.gridLeftPadding - this.gridPadding) * time.toDayPercentage()
    return this.coerceXInGrid(x)
  }

  getYFromEmployeeCount(employeeCount: number) {
    return this.gridHeight - (this.gridHeight / this.maxEmployees) * employeeCount
  }

  getTimeFromX(x: number): TimeDto {
    return TimeStep.toTimeDto(this.timeStep, (x - this.gridLeftPadding) / (this.canvas.width - this.gridLeftPadding - this.gridPadding))
  }

  getEmployeeCountFromY(y: number, includeTranslation: boolean = true): number {
    y = y - (includeTranslation ? this.yTranslate : 0)
    let gridMaxHeigth = this.gridHeight + (this.gridHeight / this.maxEmployees)
    let gridY = -(y + Math.floor((this.gridHeight / this.maxEmployees) / 2) - gridMaxHeigth)
    return (gridY > 0) ? Math.floor(gridY / (gridMaxHeigth / (this.maxEmployees + 1))) : undefined
  }

  coerceXInGrid(x: number): number {
    return x < this.gridLeftPadding ? this.gridLeftPadding : (x > this.canvas.width - this.gridPadding ? this.canvas.width - this.gridPadding : x)
  }
}

type Position = {
  x: number,
  y: number
}

type Rect = {
  x: number,
  y: number,
  w: number,
  h: number
}