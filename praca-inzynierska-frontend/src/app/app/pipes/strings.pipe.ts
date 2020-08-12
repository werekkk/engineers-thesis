import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strings'
})
export class StringsPipe implements PipeTransform {

  transform(value: string, ...args: string[]): unknown {
    if (args && args.length > 0) {
      if (args[0] == 'capitalizeFirst') {
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    } else {
      return null;
    }
  }

}
