import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  @Output()
  clickOutside = new EventEmitter()

  private wasInside = true

  constructor(
    private elementRef: ElementRef
  ) { }

  @HostListener('click')
  onClickInside() {
    this.wasInside = true
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && !this.wasInside) {
      this.clickOutside.emit(null)
    }
    this.wasInside = false
  }

  

}
