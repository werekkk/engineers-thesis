import { Pipe, PipeTransform } from '@angular/core';
import { TimeDto } from '../model/dto/TimeDto';

@Pipe({
    name: 'time'
})

export class TimePipe implements PipeTransform {
    transform(time: TimeDto, ...args: string[]): any {
        if (time) {
            if (args && args.length > 0 && args[0].toLowerCase()=='hh:mm') {
                return `${time.hour < 10 ? '0' : ''}${time.hour}:${time.minute < 10 ? '0' : ''}${time.minute}`
            } else {
                return `${time.hour}:${time.minute < 10 ? '0' : ''}${time.minute}`
            }
        } else {
            return ''
        }
    }
}