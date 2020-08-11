import { ElementRef } from '@angular/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

export class CanvasUtils {
    static RATIO = CanvasUtils.getPixelRatio()

    //https://stackoverflow.com/a/15666143/9861229
    private static getPixelRatio(): number {
        var ctx = document.createElement('canvas').getContext('2d')
        var dpr = window.devicePixelRatio || 1
        var bsr = ctx['webkitBackingStorePixelRatio'] ||
        ctx['mozBackingStorePixelRatio'] ||
        ctx['msBackingStorePixelRatio'] ||
        ctx['oBackingStorePixelRatio'] ||
        ctx['backingStorePixelRatio'] || 1;
        return dpr / bsr
    }
}

export namespace CanvasUtils {

    export class Canvas {

        context: CanvasRenderingContext2D
      
        width: number
        height: number
      
        constructor(
          public canvas: HTMLCanvasElement
        ) {
          this.context = canvas.getContext('2d')
          let ratio = CanvasUtils.RATIO
          this.width = canvas.width / ratio
          this.height = canvas.height / ratio
        }
      }

    const ratio = CanvasUtils.RATIO

    export function getHiDPIparam(x: number): number {
        return ratio * x
    }

    export function createHiDPICanvas(w: number, h: number) {
        var can = document.createElement('canvas')
        resizeCanvas(w, h, can)
        can.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0)
        return can
    }

    function resizeCanvas(w: number, h: number, canvas: HTMLCanvasElement) {
        canvas.width = w * ratio
        canvas.height = h * ratio
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
    }

    // based on https://stackoverflow.com/a/13532993/9861229
    export function darkenColor(color: string, percent: number) {
        return '#' + color.substr(1,7)
        .match(/../g) // divide string into 'r', 'g' and 'b' substrings
        .map(s => parseInt(s, 16)) // map strings to numbers
        .map(c => c * (100 - percent) / 100)
        .map(c => c > 255 ? 255 : Math.floor(c))
        .map(c => c.toString(16))
        .join('')
    }
}