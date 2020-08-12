import { Pipe, PipeTransform } from '@angular/core';
import { TimeDto } from '../model/dto/TimeDto'

@Pipe({
  name: 'dateToTime'
})
export class DateToTimePipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): TimeDto {
    return TimeDto.fromDate(value)
  }

}
