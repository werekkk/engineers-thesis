import { BehaviorSubject } from 'rxjs'
import { RequiredStaffTimePeriodDto } from '../../model/dto/RequiredStaffTimePeriodDto'
import { TimePeriodDto } from '../../model/dto/TimePeriodDto'
import * as moment from 'moment'
import { TimeDto } from '../../model/dto/TimeDto'
import { Moment } from 'moment'

export namespace Utils {

    export function createMap<K, V>(objects: V[], extractKey: (object: V) => K): Map<K, V> {
        let map = new Map()
        objects.forEach(v => map.set(extractKey(v), v))
        return map
    }

    export function weekFrom(a: Date): Date[] {
        a = firstDayOfWeekFrom(a)
        let week: Date[] = []
        for (let index = 0; index < 7; index++) {
            week.push(moment(a).add(index, 'day').toDate())            
        }
        return week
    }

    export function firstDayOfWeekFrom(a: Date): Date {
        return moment(a).isoWeekday('monday').toDate()
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

    export function copyArray<T>(array: T[]): T[] {
        let newArr: T[] = []
        array.forEach(item => newArr.push(item))
        return newArr
    }

    export function assignAndCheckForChange<T>(oldValue: T, newValue: T, assign: (value: T) => void, equals?: (a: T, b?: T) => boolean): boolean {
        if (equals && oldValue ? !equals(oldValue, newValue) : newValue != oldValue) {
            assign(newValue)
            return true
        } else {
            return false
        }
    }

    export function coerceIn(val: number, min: number, max: number): number {
        if (val < min)
            return min
        if (val > max)
            return max
        else
            return val
    }

    export function getDateArrayForCalendar(month: Moment): Date[][] {
        let startingDay = moment(month).startOf('month').startOf('isoWeek').startOf('day')
        let calendar: Date[][] = []
        let week = getWeekFromDate(startingDay)
        let endOfMonth = moment(month).endOf('month').endOf('day')
        while (moment(week[0]).isBefore(endOfMonth)) {
            calendar.push(week)
            startingDay = startingDay.add(1, 'week')
            week = getWeekFromDate(startingDay)
        }
        return calendar
    }

    function getWeekFromDate(day: moment.Moment): Date[] {
        let currentDay = moment(day)
        let week: Date[] = []
        for (let i = 0; i < 7; i++) {
            week.push(currentDay.toDate())
            currentDay = currentDay.add(1, 'day')
        }
        return week
    }

}