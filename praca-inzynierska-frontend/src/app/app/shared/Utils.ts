import { BehaviorSubject } from 'rxjs'
import { RequiredStaffTimePeriodDto } from '../model/dto/RequiredStaffTimePeriodDto'
import { TimePeriodDto } from '../model/dto/TimePeriodDto'
import * as moment from 'moment'

export class Utils {

    static weekFrom(a: Date): Date[] {
        let week: Date[] = []
        for (let index = 0; index < 7; index++) {
            week.push(moment(a).add(index, 'day').toDate())            
        }
        return week
    }

    static daysDiff(a: Date, b: Date): number {
        return moment(b).startOf('day').diff(moment(a).startOf('day'), 'days')
    }

    static daysAfter(day: Date, days: number): Date {
        let newDate = new Date(day)
        newDate.setDate(newDate.getDate() + days)
        return newDate
    }

    static fixDateToBackendFormat(date: Date): Date {
        return moment(date).utc(true).toDate()
    }

    static emptyBooleanArray(length: number): boolean[] {
        let arr = []
        for (let i = 0; i < length; i++) {
            arr.push(false)
        }
        return arr
    }

    static replaceArray<T>(array: T[], newElem: T, predicate: (value: T) => boolean): T[] {
        let index = array.findIndex(predicate)
        if (index != -1) {
            array[index] = newElem
        }
        return array
    }

    static optimizeRequirements(requirements: RequiredStaffTimePeriodDto[]): RequiredStaffTimePeriodDto[] {
        requirements = requirements.map((req, index) => {
            req['priority'] = index
            return req
        })
        let sortedRequirements = requirements.sort((a, b) => {
            let diff = a.timePeriod.start.toSeconds() - b.timePeriod.start.toSeconds()
            return diff ? diff : (a.timePeriod.finish.toSeconds() - b.timePeriod.finish.toSeconds())
        })
        let newRequirements: RequiredStaffTimePeriodDto[] = []
        sortedRequirements.forEach(req => {
            if (newRequirements.length > 0) {
                let lastReq = newRequirements[newRequirements.length - 1]
                if (req.timePeriod.start.toSeconds() < lastReq.timePeriod.finish.toSeconds()) {
                    if (req.timePeriod.finish.toSeconds() <= lastReq.timePeriod.finish.toSeconds()) {
                        if (req.employeeCount == lastReq.employeeCount) {
                            return
                        } else if (req['priority'] > lastReq['priority']) {
                            // if req.employeeCount == 0, then user is clearing the period
                            if (req.employeeCount > 0) {
                                newRequirements.push(req)
                            }
                            newRequirements.push(new RequiredStaffTimePeriodDto(0, lastReq.employeeCount,
                                new TimePeriodDto(req.timePeriod.finish, lastReq.timePeriod.finish)))
                            lastReq.timePeriod.finish = req.timePeriod.start
                            return
                        } else {
                            return
                        }
                    } else {
                        if (req['priority'] > lastReq['priority']) {
                            lastReq.timePeriod.finish = req.timePeriod.start
                        } else {
                            req.timePeriod.start = lastReq.timePeriod.finish
                        }
                    }
                }
            }
            if (req.employeeCount > 0) {
                newRequirements.push(req)
            }
        });
        return newRequirements.filter(a => !a.timePeriod.start.equals(a.timePeriod.finish))
    }

    /**
     * Requirements array is optimized when:
     * - all requirements are sorted by their period's start time and finish time,
     * - all requirements' `employeeCount` parameter is a positive integer (greater than 0),
     * - no requirement periods last 0 seconds,
     * - no requirement periods are overlapping.
     * 
     * @param reqs Already optimized requirements array.
     * @param newReq New requirement to be inserted. 
     * If `employeeCount = 0`, the `reqs` array is going to be transformed 
     * so that none of the requirement's periods are overlapping with the `newReq.timePeriod`.
     *  
     * @returns Optimized `reqs` array
     */
    static insertRequirementAndOptimize(reqs: RequiredStaffTimePeriodDto[], newReq: RequiredStaffTimePeriodDto): RequiredStaffTimePeriodDto[] {
        if (newReq.timePeriod.start.equals(newReq.timePeriod.finish)) {
            return reqs
        }
        if (reqs.length > 0) {
            let firstOverlappingReqId = reqs.findIndex(req => req.timePeriod.overlaps(newReq.timePeriod))
            if (firstOverlappingReqId != -1) {
                let currentId = firstOverlappingReqId
                while (reqs.length > currentId && reqs[currentId].timePeriod.overlaps(newReq.timePeriod)) {
                   let currentReq = reqs[currentId]
                   if (currentReq.timePeriod.start.toSeconds() >= newReq.timePeriod.start.toSeconds()
                   && currentReq.timePeriod.finish.toSeconds() <= newReq.timePeriod.finish.toSeconds()) {
                       reqs.splice(currentId, 1)
                   } else if (currentReq.timePeriod.start.toSeconds() >= newReq.timePeriod.start.toSeconds()) {
                       currentReq.timePeriod.start = newReq.timePeriod.finish
                       break
                   } else if (currentReq.timePeriod.finish.toSeconds() <= newReq.timePeriod.finish.toSeconds()) {
                       currentReq.timePeriod.finish = newReq.timePeriod.start
                       currentId++
                   } else {
                       reqs.splice(currentId + 1, 0, new RequiredStaffTimePeriodDto(0, currentReq.employeeCount,
                        new TimePeriodDto(newReq.timePeriod.finish, currentReq.timePeriod.finish)))
                       currentReq.timePeriod.finish = newReq.timePeriod.start
                       break
                   }
               }
            }
        }
        reqs.filter(req => !req.timePeriod.start.equals(req.timePeriod.finish))
        if (newReq.employeeCount > 0) {
            reqs = this.insertRequirementInGap(reqs, newReq)
        }
        return reqs
    }

    private static insertRequirementInGap(reqs: RequiredStaffTimePeriodDto[], newReq: RequiredStaffTimePeriodDto): RequiredStaffTimePeriodDto[] {
        let insertPosition = 0
        let shouldInsert = true
        while (reqs.length > insertPosition &&
        reqs[insertPosition].timePeriod.finish.toSeconds() <= newReq.timePeriod.start.toSeconds()) {
            insertPosition++
        }
        if (insertPosition > 0 && reqs.length > insertPosition-1
        && reqs[insertPosition-1].employeeCount == newReq.employeeCount
        && reqs[insertPosition-1].timePeriod.finish.equals(newReq.timePeriod.start)) {
            reqs[insertPosition-1].timePeriod.finish = newReq.timePeriod.finish
            newReq = reqs[insertPosition-1]
            shouldInsert = false
        }
        if (insertPosition < reqs.length
        && reqs[insertPosition].employeeCount == newReq.employeeCount
        && reqs[insertPosition].timePeriod.start.equals(newReq.timePeriod.finish)) {
            newReq.timePeriod.finish = reqs[insertPosition].timePeriod.finish
            reqs.splice(insertPosition, 1)
        }
        if (shouldInsert) {
            reqs.splice(insertPosition, 0, newReq)
        }
        return reqs
    }

}