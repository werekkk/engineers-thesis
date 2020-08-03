import { Pipe, PipeTransform } from '@angular/core';
import { TimeDto } from '../model/dto/TimeDto';

@Pipe({
    name: 'time'
})

export class TimePipe implements PipeTransform {
    transform(time: TimeDto, ...args: any[]): any {
        if (time) {
            return `${time.hour}:${time.minute < 10 ? '0' : ''}${time.minute}`
        } else {
            return ''
        }
    }
}