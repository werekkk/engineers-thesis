import { RequiredStaffTimePeriodDto } from '../../model/dto/RequiredStaffTimePeriodDto'
import { TimeDto } from '../../model/dto/TimeDto'
import { TimePeriodDto } from '../../model/dto/TimePeriodDto'

import { PeriodUtils } from './period-utils'

describe("PeriodUtils", () => {

    it("insert to an empty array", () => {
        let p1 = new RequiredStaffTimePeriodDto(1, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(9, 0)))

        let arr = []
        arr = PeriodUtils.insertPeriodAndOptimize(arr, p1)

        expect(requiredStaffArrayEqual(arr, [p1])).toBeTrue()
    })

    it("join two adjacent periods", () => {
        let p1 = new RequiredStaffTimePeriodDto(1, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(9, 0)))
        let p2 = new RequiredStaffTimePeriodDto(2, 2, new TimePeriodDto(new TimeDto(9, 0), new TimeDto(10, 0)))
        let p4 = new RequiredStaffTimePeriodDto(4, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(10, 0)))

        let arr = [p1]
        arr = PeriodUtils.insertPeriodAndOptimize(arr, p2) as RequiredStaffTimePeriodDto[]

        expect(requiredStaffArrayEqual(arr, [p4])).toBeTrue()
    })

    it("join two overlapping periods", () => {
        let p1 = new RequiredStaffTimePeriodDto(1, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(9, 0)))
        let p3 = new RequiredStaffTimePeriodDto(3, 2, new TimePeriodDto(new TimeDto(8, 30), new TimeDto(10, 0)))
        let p4 = new RequiredStaffTimePeriodDto(4, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(10, 0)))

        let arr = [p1]
        arr = PeriodUtils.insertPeriodAndOptimize(arr, p3) as RequiredStaffTimePeriodDto[]

        expect(requiredStaffArrayEqual(arr, [p4])).toBeTrue()
    })

    it("remove period", () => {
        let p4 = new RequiredStaffTimePeriodDto(4, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(10, 0)))
        let p5 = new RequiredStaffTimePeriodDto(5, 0, new TimePeriodDto(new TimeDto(8, 30), new TimeDto(9, 30)))
        let p6 = new RequiredStaffTimePeriodDto(6, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(8, 30)))
        let p7 = new RequiredStaffTimePeriodDto(7, 2, new TimePeriodDto(new TimeDto(9, 30), new TimeDto(10, 0)))

        let arr = [p4]
        arr = PeriodUtils.insertPeriodAndOptimize(arr, p5) as RequiredStaffTimePeriodDto[]

        expect(requiredStaffArrayEqual(arr, [p6, p7])).toBeTrue()
    })

    it("insert period inside another", () => {     
        let p4 = new RequiredStaffTimePeriodDto(4, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(10, 0)))
        let p6 = new RequiredStaffTimePeriodDto(6, 2, new TimePeriodDto(new TimeDto(8, 0), new TimeDto(8, 30)))
        let p7 = new RequiredStaffTimePeriodDto(7, 2, new TimePeriodDto(new TimeDto(9, 30), new TimeDto(10, 0)))
        let p8 = new RequiredStaffTimePeriodDto(8, 4, new TimePeriodDto(new TimeDto(8, 30), new TimeDto(9, 30)))

        let arr = [p4]
        arr = PeriodUtils.insertPeriodAndOptimize(arr, p8) as RequiredStaffTimePeriodDto[]

        expect(requiredStaffArrayEqual(arr, [p6, p8, p7])).toBeTrue()
    })

})

function requiredStaffArrayEqual(arr1: RequiredStaffTimePeriodDto[], arr2: RequiredStaffTimePeriodDto[]) { 
    arr1.sort(RequiredStaffTimePeriodDto.comparePeriods)
    arr2.sort(RequiredStaffTimePeriodDto.comparePeriods)
    return !arr1.some((rs, i) => {
        return !rs.equalsWithoutId(arr2[i])
    })
}