import { Pipe, PipeTransform } from '@angular/core';
import { TimePeriodDto } from '../model/dto/TimePeriodDto';

@Pipe({
  name: 'periodLength'
})
export class PeriodLengthPipe implements PipeTransform {

  transform(period: TimePeriodDto, ...args: unknown[]): string {
    let seconds = period.finish.toSeconds() - period.start.toSeconds()
    let hrs = Math.floor(seconds / 3600)
    let minutes = Math.floor((seconds % 3600) / 60)
    return (hrs?`${hrs} godz.`:'') + (hrs&&minutes?' ':'') + (minutes ? `${minutes} min.` : '')
  }

}
