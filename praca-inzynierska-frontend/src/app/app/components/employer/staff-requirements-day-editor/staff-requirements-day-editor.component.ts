import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Canvas, createHiDPICanvas, getHiDPIparam } from './Canvas';
import { RequiredStaffTimePeriodDto } from '../../../model/dto/RequiredStaffTimePeriodDto'
import { TimeStep } from './TimeStep'
import { TimeDto } from 'src/app/app/model/dto/TimeDto';
import { TimePeriod } from 'src/app/app/model/TimePeriod';
import { TimePeriodDto } from 'src/app/app/model/dto/TimePeriodDto';
import { interval, timer } from 'rxjs';

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
    this.adjustMaxWorkersByTimePeriods()
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

  highlightedWorkerCount = 0
  highlightedHour: TimeDto = null

  minMaxWorkers = 5
  maxMaxWorkers = 20

  _maxWorkers = this.minMaxWorkers
  set maxWorkers(value: number) {
    if (value != this._maxWorkers && value >= this.minMaxWorkers && value <= this.maxMaxWorkers) {
      this._maxWorkers = value
      this.gridHeight = this.maxWorkers * this.workerLineHeight
      if (this.canvas) {
        this.initCanvas()
      }
    }
  }
  get maxWorkers(): number {
    return this._maxWorkers
  }

  adjustMaxWorkersByTimePeriods() {
    let newMaxWorkers = this.timePeriods.length > 0 ? this.timePeriods.map(tp => tp.employeeCount).reduceRight((prev, cur) => prev > cur ? prev : cur) : 0
    this.maxWorkers = newMaxWorkers > this.minMaxWorkers ? newMaxWorkers : this.minMaxWorkers
  }

  _workerLineHeight = 20
  set workerLineHeight(value: number) {
    this._workerLineHeight = value
    this.gridHeight = this.maxWorkers * this.workerLineHeight
  }
  get workerLineHeight(): number {
    return this._workerLineHeight
  }

  get totalCanvasHeight(): number {
    return this.yTranslate + this.gridHeight + this.valueLabelHeight + this.labelFontSize
  }

  gridHeight = this.maxWorkers * this.workerLineHeight
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
    this.initCanvas()
  }

  initCanvas() {
    let hiDpiCanvas = createHiDPICanvas(this.canvasElement.nativeElement.width, this.totalCanvasHeight)
    if (!this.canvas) {
      this.canvasElement.nativeElement.replaceWith(hiDpiCanvas)
    } else {
      this.canvas.canvas.replaceWith(hiDpiCanvas)
    }
    this.canvas = new Canvas(hiDpiCanvas)
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
    this.setHighlightedWorkerCount(ev.offsetY)
    this.setHighlightedHour(ev.offsetX, ev.offsetY)
    if (this.createdBlockStart) {
      if (this.isAboveHighestWorkerCountLine()) {
        this.startIncreasingMaxWorkers()
      }
      this.createdBlockStart.y = this.getYFromWorkerCount(Math.min(this.highlightedWorkerCount, this.maxWorkers))
      this.updateCreatedBlockFinish(ev)
    }
    if (this.mouseMoveChange) {
      this.requestRedraw()
    }
  }

  increasingTimer = undefined
  
  startIncreasingMaxWorkers() {
    if (!this.increasingTimer) {
      this.increasingTimer = timer(0, 200).subscribe(() => {
        if (this.createdBlockStart && this.isAboveHighestWorkerCountLine() && this.maxWorkers < this.maxMaxWorkers) {
          this.maxWorkers++
        } else {
          this.increasingTimer.unsubscribe()
          this.increasingTimer = undefined
        }
      })
    }
  }

  isAboveHighestWorkerCountLine(): boolean {
    return this.getWorkerCountFromY(this.latestMove.offsetY) > this.maxWorkers
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

  setHighlightedWorkerCount(y: number) {
    let newHighlightedWorker = this.getWorkerCountFromY(y)
    if (newHighlightedWorker != this.highlightedWorkerCount) {
      this.highlightedWorkerCount = newHighlightedWorker
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
    this.highlightedWorkerCount = undefined
    this.highlightedHour = undefined
    this.createdBlockStart = null
    this.createdBlockFinish = null
    this.adjustMaxWorkersByTimePeriods()
    this.requestRedraw()
  }

  handleOnMouseDown(this: StaffRequirementsDayEditorComponent, ev: MouseEvent) {
      let newCreatedBlockStart = {
        x: this.getXFromTime(this.highlightedHour, this.canvas), 
        y: this.getYFromWorkerCount(this.highlightedWorkerCount)
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
    this.adjustMaxWorkersByTimePeriods()
  }

  createRequirement(start: Position, finish: Position) {
    if (start.x != finish.x) {
      if (finish.x < start.x) {
        let temp = finish.x
        finish.x = start.x
        start.x = temp
      }
      let period = new TimePeriodDto(this.getTimeFromX(start.x), this.getTimeFromX(finish.x))
      let workerCount = this.getWorkerCountFromY(start.y, false)
      if (workerCount != undefined) {
        let requirement = new RequiredStaffTimePeriodDto(0, this.getWorkerCountFromY(start.y, false), period)
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
    
    this.drawWorkerLines(canvas)
    this.drawWorkerCountLabel(canvas)
    this.drawWorkerValueLabels(canvas)

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
      let isDeleting = this.highlightedWorkerCount == 0
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

  drawWorkerLines(canvas: Canvas) {
    let ctx = canvas.context
    let width = canvas.width
    for (let i = 0; i <= this.maxWorkers; i++) {
      let heigth = this.getYFromWorkerCount(i)
      let drawingHighlighted = i == this.highlightedWorkerCount
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

  drawWorkerCountLabel(canvas: Canvas) {
    let ctx = canvas.context
    this.setLabelFont(ctx)
    ctx.save()
    ctx.translate(this.gridLeftPadding, this.gridHeight / 2)
    ctx.rotate(270 * Math.PI / 180)
    ctx.fillText('Liczba', 0, -this.valueLabelHeight - this.labelFontSize * 2)
    ctx.fillText('pracowników', 0, -this.valueLabelHeight - this.labelFontSize)
    ctx.restore()
  }

  drawWorkerValueLabels(canvas: Canvas) {
    let ctx = canvas.context
    ctx.save()
    ctx.textBaseline = 'middle'
    this.setLabelFont(ctx)
    for (let i = 0; i <= this.maxWorkers; i++) {
      if (i == this.highlightedWorkerCount) {
        this.setLabelFont(ctx, 'bold', 17)
        ctx.fillText(i+'', this.gridLeftPadding - (this.valueLabelHeight / 2) - this.gridStickOutSize, this.getYFromWorkerCount(i))
        this.setLabelFont(ctx)
      } else {
        ctx.fillText(i+'', this.gridLeftPadding - (this.valueLabelHeight / 2) - this.gridStickOutSize, this.getYFromWorkerCount(i))
      }
    }
    ctx.restore()
  }

  getRectFromPeriod(period: RequiredStaffTimePeriodDto, canvas: Canvas): Rect {
    let x1 = this.getXFromTime(period.timePeriod.start, canvas)
    let x2 = this.getXFromTime(period.timePeriod.finish, canvas)
    let y1 = this.getYFromWorkerCount(period.employeeCount)
    let y2 = this.getYFromWorkerCount(0)
    return {x: x1, y: y1, w: (x2 - x1), h: (y2 - y1)}
  }

  setLabelFont(context: CanvasRenderingContext2D, style: string = '', fontSize: number = null) {
    context.font = `${style} ${fontSize ? fontSize: this.labelFontSize}px Helvetica`
    context.textAlign = 'center'
  }

  getXFromTime(time: TimeDto, canvas: Canvas) {
    let w = canvas.width
    let x = this.gridLeftPadding + (w - this.gridLeftPadding - this.gridPadding) * time.toDayPercentage()
    return this.coerceXInGrid(x)
  }

  getYFromWorkerCount(workerCount: number) {
    return this.gridHeight - (this.gridHeight / this.maxWorkers) * workerCount
  }

  getTimeFromX(x: number): TimeDto {
    return TimeStep.toTimeDto(this.timeStep, (x - this.gridLeftPadding) / (this.canvas.width - this.gridLeftPadding - this.gridPadding))
  }

  getWorkerCountFromY(y: number, includeTranslation: boolean = true): number {
    y = y - (includeTranslation ? this.yTranslate : 0)
    let gridMaxHeigth = this.gridHeight + (this.gridHeight / this.maxWorkers)
    let gridY = -(y + Math.floor((this.gridHeight / this.maxWorkers) / 2) - gridMaxHeigth)
    return (gridY > 0) ? Math.floor(gridY / (gridMaxHeigth / (this.maxWorkers + 1))) : undefined
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