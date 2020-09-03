import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[onEnterPressed]'
})
export class OnEnterPressedDirective {

  @Output('onEnterPressed')
  onEnterPressed: EventEmitter<null> = new EventEmitter()

  constructor() { }

  @HostListener('document:keydown.enter', ['$event']) 
  onEvent(event: KeyboardEvent) {
    this.onEnterPressed.emit(null)
  }

}
