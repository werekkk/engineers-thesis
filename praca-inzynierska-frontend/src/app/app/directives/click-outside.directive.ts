import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

//https://christianliebel.com/2016/05/angular-2-a-simple-click-outside-directive/
//https://stackoverflow.com/a/46656671/9861229

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {

  @Output('clickOutside')
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
