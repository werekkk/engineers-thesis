import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayOfWeek'
})
export class DayOfWeekPipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): string {
    switch (value.getDay()) {
      case 1:
        return 'Poniedziałek'
      case 2:
        return 'Wtorek'
      case 3:
        return 'Środa'
      case 4:
        return 'Czwartek'
      case 5:
        return 'Piątek'
      case 6:
        return 'Sobota'
      case 0:
        return 'Niedziela'
      default:
        return ''
    }
  }

}
