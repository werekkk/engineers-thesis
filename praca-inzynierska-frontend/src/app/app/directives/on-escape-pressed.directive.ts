import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[onEscapePressed]'
})
export class OnEscapePressedDirective {

  @Output('onEscapePressed')
  onEscapePressed: EventEmitter<null> = new EventEmitter()

  constructor() { }

  @HostListener('document:keydown.escape', ['$event']) 
  onEvent(event: KeyboardEvent) {
    this.onEscapePressed.emit(null)
  }

}
