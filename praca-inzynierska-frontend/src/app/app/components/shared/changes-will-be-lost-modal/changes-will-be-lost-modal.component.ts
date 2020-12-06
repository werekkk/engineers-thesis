import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export type ChangesModalResult = 'save' | 'dismiss' | 'cancel'

export type FromParentData = {
  title: string,
  paragraphs: string[]
}

@Component({
  selector: 'changes-will-be-lost-modal',
  templateUrl: './changes-will-be-lost-modal.component.html',
  styleUrls: ['./changes-will-be-lost-modal.component.scss']
})
export class ChangesWillBeLostModalComponent {

  static STAFF_CHANGES_DATA = {
    title: 'Czy chcesz zapisać zmiany?',
    paragraphs: [
      'Wprowadzono zmiany w obsadzie.',
      'Zapisać zmiany?'
    ]
  }

  static GENERATED_SCHEDULE_DATA = {
    title: 'Czy chcesz zapisać grafik?',
    paragraphs: [
      'Po opuszczeniu tego widoku wygenerowany grafik nie zostanie zapisany.',
      'Czy chcesz zapisać wygenerowany grafik?'
    ]
  }

  static PREFERENCES_CHANGES_DATA = {
    title: 'Czy chcesz zapisać preferencje tygodniowe?',
    paragraphs: [
      'Wprowadzono zmiany w preferencjach tygodniowych.',
      'Zapisać zmiany?'
    ]
  }

  fromParent: FromParentData

  constructor(
    public modal: NgbActiveModal
  ) { }

}
