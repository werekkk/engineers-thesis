import { PreferenceType } from '../PreferenceType';
import { HasTimePeriod } from '../HasTimePeriod';
import { TimePeriodDto } from './TimePeriodDto';
import { TimeDto } from './TimeDto';
import { TimePeriod } from '../TimePeriod';
import { Utils } from '../../shared/utils';

export class OneTimeHourPreferenceDto implements HasTimePeriod {

    constructor(
        public id: number,
        public type: PreferenceType,
        public start: Date,
        public finish: Date
    ) {}

    get timePeriod(): TimePeriodDto {
        return new TimePeriodDto(TimeDto.fromDate(this.start), TimeDto.fromDate(this.finish))
    }
    set timePeriod(val: TimePeriodDto) {
        this.start = val.start.createDateTime(this.start)
        this.finish = val.finish.createDateTime(this.finish)
    }

    get periodType(): PreferenceType {
        return this.type
    }

    doNotKeep() {
        return false
    }

    withNewPeriod(newPeriod: TimePeriodDto): HasTimePeriod {
        return new OneTimeHourPreferenceDto(
            this.id, 
            this.type, 
            newPeriod.start.createDateTime(this.start), 
            newPeriod.finish.createDateTime(this.finish)
        );
    }

    setStartTime(newStart: TimeDto) {
        this.start = newStart.createDateTime(this.start)
    }

    setFinishTime(newFinish: TimeDto) {
        this.finish = newFinish.createDateTime(this.finish)
    }

    datesToBackend() {
        this.start = Utils.fixDateToBackendFormat(this.start)
        this.finish = Utils.fixDateToBackendFormat(this.finish)
    }

    static toObject(other: OneTimeHourPreferenceDto): OneTimeHourPreferenceDto {
        return new OneTimeHourPreferenceDto(
            other.id,
            other.type,
            new Date(other.start),
            new Date(other.finish)
        )
    }

}