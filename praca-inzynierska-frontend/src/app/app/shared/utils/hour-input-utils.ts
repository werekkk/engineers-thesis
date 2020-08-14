import * as moment from 'moment'
import { TimeDto } from '../../model/dto/TimeDto'

export namespace HourInputUtils {

    export function stringToHour(str: string): string {
        while (str && !str.charAt(0).match(/[0-9]/g)) {
            str = str.substring(1, str.length)
        }
        if (str) {
            let [hour, min] = str.split(':').map(s => s.replace(/\D/g,''))
            min = min ? min.substr(0, Math.min(min.length, 2)) : null
            if (hour.length == 3) {
              min = hour.substr(1, 2)
              hour = `0${hour.substr(0, 1)}`
            } else if (hour.length > 3) {
              min = hour.substr(2, 2)
              hour = hour.substr(0, 2)
            } 
            if (hour == '24' && (min == '00' || min == '0' || !min)) {
              return '24:00'
            }
            if (+hour >= 0 && +hour <= 23 && (!min || (+min >= 0 && +min < 60))) {
              return moment().hour(+hour).minute(+min).format('HH:mm')
            } else {
              return null
            }
          } else {
            return null
          }
    }

    export function stringToClosestHour(str: string, allHours: TimeDto[]): TimeDto {
        while (str && !str.charAt(0).match(/[0-9]/g)) {
          str = str.substring(1, str.length)
        }
        if (str) {
          let [hour, min] = str.split(':').map(s => s.replace(/\D/g,''))
          min = min ? min.substr(0, Math.min(min.length, 2)) : null
          if (hour.length == 3) {
            min = hour.substr(1, 2)
            hour = hour.substr(0, 1)
          } else if (hour.length > 3) {
            min = hour.substr(2, 2)
            hour = hour.substr(0, 2)
          }
          return findClosestHour(hour, min, allHours)
        } else {
          return null
        }
        
      }
    
      function findClosestHour(hour: string, minute: string, allHours: TimeDto[]): TimeDto {
        let possibleHours = findAllHoursWithHour(+hour, allHours)
        if (!minute) {
          return possibleHours.length > 0 ? possibleHours[0] : null
        } else {
          return findHourMatchingMinutes(possibleHours, minute)
        }
      }
    
      function findAllHoursWithHour(hour: number, allHours: TimeDto[]): TimeDto[] {
        return allHours.filter(h => h.hour == hour)
      }
    
      function findHourMatchingMinutes(hours: TimeDto[], minutes: string): TimeDto {
        if (minutes.length == 1) {
          return hours.find(h => Math.floor(h.minute / 10) == +minutes) || hours[0] || null
        } else {
          return hours.find(h => h.minute == +minutes) || hours[0] || null
        }
      }

}