import { BehaviorSubject } from 'rxjs'
import { RequiredStaffTimePeriodDto } from '../model/dto/RequiredStaffTimePeriodDto'
import { TimePeriodDto } from '../model/dto/TimePeriodDto'
import * as moment from 'moment'

export namespace Utils {

    export function weekFrom(a: Date): Date[] {
        let week: Date[] = []
        for (let index = 0; index < 7; index++) {
            week.push(moment(a).add(index, 'day').toDate())            
        }
        return week
    }

    export function daysDiff(a: Date, b: Date): number {
        return moment(b).startOf('day').diff(moment(a).startOf('day'), 'days')
    }

    export function daysAfter(day: Date, days: number): Date {
        let newDate = new Date(day)
        newDate.setDate(newDate.getDate() + days)
        return newDate
    }

    export function fixDateToBackendFormat(date: Date): Date {
        return moment(date).utc(true).toDate()
    }

    export function emptyBooleanArray(length: number): boolean[] {
        let arr = []
        for (let i = 0; i < length; i++) {
            arr.push(false)
        }
        return arr
    }

    export function replaceArray<T>(array: T[], newElem: T, predicate: (value: T) => boolean): T[] {
        let index = array.findIndex(predicate)
        if (index != -1) {
            array[index] = newElem
        }
        return array
    }

}