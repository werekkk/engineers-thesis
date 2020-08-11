import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayOfWeek'
})
export class DayOfWeekPipe implements PipeTransform {

  static DAY_NAMES: string[] = [
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
    'Niedziela'
  ]

  transform(value: Date | number, ...args: unknown[]): string {
    if (value instanceof Date) {
      return DayOfWeekPipe.DAY_NAMES[(value.getDay() + 7 - 1) % 7]
    } else if (typeof value === 'number') {
      return DayOfWeekPipe.DAY_NAMES[value]
    }
  }

}
