export class Canvas {

  context: CanvasRenderingContext2D

  width: number
  height: number

  constructor(
    public canvas: HTMLCanvasElement
  ) {
    this.context = canvas.getContext('2d')
    let ratio = getPixelRatio()
    this.width = canvas.width / ratio
    this.height = canvas.height / ratio
  }
}

//https://stackoverflow.com/a/15666143/9861229
function getPixelRatio(): number {
    var ctx = document.createElement('canvas').getContext('2d')
    var dpr = window.devicePixelRatio || 1
    var bsr = ctx['webkitBackingStorePixelRatio'] ||
    ctx['mozBackingStorePixelRatio'] ||
    ctx['msBackingStorePixelRatio'] ||
    ctx['oBackingStorePixelRatio'] ||
    ctx['backingStorePixelRatio'] || 1;
    return dpr / bsr
}

const ratio = getPixelRatio()

export function getHiDPIparam(x: number): number {
  return ratio * x
}

export function createHiDPICanvas(w, h) {
    var can = document.createElement('canvas')
    resizeCanvas(w, h, can)
    can.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0)
    return can
}

function resizeCanvas(w, h, canvas: HTMLCanvasElement) {
  canvas.width = w * ratio
  canvas.height = h * ratio
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`

}