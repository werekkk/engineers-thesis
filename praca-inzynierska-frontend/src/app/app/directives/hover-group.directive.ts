import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[hoverGroup]'
})
export class HoverGroupDirective implements OnDestroy {

  private static currentGroup: EventEmitter<number[]> = new EventEmitter()

  @Input()
  hoverGroup: number | number[] = 0

  @Input('classOnHover')
  setClassOnHover: string = ''

  private emitterSubscription: Subscription

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { 
    this.emitterSubscription = HoverGroupDirective.currentGroup.subscribe(g => this.handleNewGroup(g))
  }

  ngOnDestroy() {
    this.emitterSubscription.unsubscribe()
  }

  @HostListener('mouseenter') 
  onMouseEnter() {
    if (typeof this.hoverGroup === 'number') {
      HoverGroupDirective.currentGroup.emit([this.hoverGroup])
    } else {
      HoverGroupDirective.currentGroup.emit(this.hoverGroup)
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    HoverGroupDirective.currentGroup.emit(null)
  }

  handleNewGroup(newGroup: number[]) {
    if (newGroup && newGroup.some(g => {
      if (typeof this.hoverGroup === 'number') {
        return g == this.hoverGroup
      } else {
        return this.hoverGroup.some(tg => tg == g)
      }
    })) {
      this.renderer.addClass(this.elementRef.nativeElement, this.setClassOnHover)
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, this.setClassOnHover)
    }
  }

}
