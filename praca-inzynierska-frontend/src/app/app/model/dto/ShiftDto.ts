import { ShiftType } from "../ShiftType";
import { TimePeriodDto } from './TimePeriodDto';
import { TimeDto } from './TimeDto';
import { Utils } from '../../shared/utils/utils';

export class ShiftDto {

    constructor(
        public id: number = 0,
        public employeeId: number,
        public positionId: number,
        public start: Date,
        public finish: Date,
        public creationDate: Date,
        public shiftType: ShiftType
    ) {}

    get period(): TimePeriodDto {
        return new TimePeriodDto(
            TimeDto.fromDate(this.start),
            TimeDto.fromDate(this.finish)
        )
    }

    static copy(of: ShiftDto): ShiftDto {
        return new ShiftDto(
            of.id,
            of.employeeId,
            of.positionId,
            new Date(of.start),
            new Date(of.finish),
            new Date(of.creationDate),
            of.shiftType
        )
    }

    addTimeZoneToDates(): ShiftDto {
        return new ShiftDto(
            this.id, this.employeeId, this.positionId,
            Utils.fixDateToBackendFormat(this.start),
            Utils.fixDateToBackendFormat(this.finish),
            this.creationDate, this.shiftType
        )
    }

    equalPeriods(other: ShiftDto) {
        return this.period.compare(other.period) == 0
    }
}