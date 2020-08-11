import { RequiredStaffTimePeriodDto } from '../model/dto/RequiredStaffTimePeriodDto'
import { TimePeriodDto } from '../model/dto/TimePeriodDto'
import { HasTimePeriod } from '../model/HasTimePeriod'

export namespace PeriodUtils {

    /**
     * Time period array is optimized when:
     * - all periods are sorted by their start time and finish time,
     * - no two neighbouring periods are of the same type
     * - no requirement periods last 0 seconds,
     * - no requirement periods are overlapping.
     * 
     * @param pers Already optimized periods array.
     * @param newPer New period to be inserted. 
     * If `newPer.doNotKeep() == true`, the `reqs` array is going to be transformed 
     * so that none of the requirement's periods are overlapping with the `newPer.timePeriod`
     * and `newPer` is not going to be kept in the returned array. 
     *  
     * @returns Optimized `reqs` array
     */
    export function insertPeriodAndOptimize(pers: HasTimePeriod[], newPer: HasTimePeriod): HasTimePeriod[] {
        if (newPer.timePeriod.start.equals(newPer.timePeriod.finish)) {
            return pers
        }
        if (pers.length > 0) {
            let firstOverlappingReqId = pers.findIndex(req => req.timePeriod.overlaps(newPer.timePeriod))
            if (firstOverlappingReqId != -1) {
                let currentId = firstOverlappingReqId
                while (pers.length > currentId && pers[currentId].timePeriod.overlaps(newPer.timePeriod)) {
                   let currentReq = pers[currentId]
                   if (currentReq.timePeriod.start.toSeconds() >= newPer.timePeriod.start.toSeconds()
                   && currentReq.timePeriod.finish.toSeconds() <= newPer.timePeriod.finish.toSeconds()) {
                       pers.splice(currentId, 1)
                   } else if (currentReq.timePeriod.start.toSeconds() >= newPer.timePeriod.start.toSeconds()) {
                       currentReq.timePeriod.start = newPer.timePeriod.finish
                       break
                   } else if (currentReq.timePeriod.finish.toSeconds() <= newPer.timePeriod.finish.toSeconds()) {
                       currentReq.timePeriod.finish = newPer.timePeriod.start
                       currentId++
                   } else {
                       pers.splice(
                           currentId + 1, 
                           0, 
                           currentReq.withNewPeriod(new TimePeriodDto(newPer.timePeriod.finish, currentReq.timePeriod.finish))
                        )
                       currentReq.timePeriod.finish = newPer.timePeriod.start
                       break
                   }
               }
            }
        }
        pers.filter(req => !req.timePeriod.start.equals(req.timePeriod.finish))
        if (!newPer.doNotKeep()) {
            pers = insertPeriodInGap(pers, newPer)
        }
        return pers
    }

    function insertPeriodInGap(pers: HasTimePeriod[], newPer: HasTimePeriod): HasTimePeriod[] {
        let insertPosition = 0
        let shouldInsert = true
        while (pers.length > insertPosition &&
        pers[insertPosition].timePeriod.finish.toSeconds() <= newPer.timePeriod.start.toSeconds()) {
            insertPosition++
        }
        if (insertPosition > 0 && pers.length > insertPosition-1
        && pers[insertPosition-1].periodType == newPer.periodType
        && pers[insertPosition-1].timePeriod.finish.equals(newPer.timePeriod.start)) {
            pers[insertPosition-1].timePeriod.finish = newPer.timePeriod.finish
            newPer = pers[insertPosition-1]
            shouldInsert = false
        }
        if (insertPosition < pers.length
        && pers[insertPosition].periodType == newPer.periodType
        && pers[insertPosition].timePeriod.start.equals(newPer.timePeriod.finish)) {
            newPer.timePeriod.finish = pers[insertPosition].timePeriod.finish
            pers.splice(insertPosition, 1)
        }
        if (shouldInsert) {
            pers.splice(insertPosition, 0, newPer)
        }
        return pers
    }
}