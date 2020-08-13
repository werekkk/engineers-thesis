import { PreferenceType } from '../PreferenceType';
import { TimePeriodDto } from './TimePeriodDto';
import { HourPreferenceBackendDto } from './backend/HourPreferenceBackendDto';
import { HasTimePeriod } from '../HasTimePeriod';
import { TimeDto } from './TimeDto';

export class HourPreferenceDto implements HasTimePeriod {

    get periodType(): PreferenceType {
        return this.type
    }

    constructor(
        public type: PreferenceType,
        public timePeriod: TimePeriodDto
    ) {}

    static of(hp: HourPreferenceBackendDto): HourPreferenceDto {
        return new HourPreferenceDto(hp.type, TimePeriodDto.of(hp.timePeriod))
    }

    doNotKeep(): boolean {
        return false
    }

    withNewPeriod(timePeriod: TimePeriodDto): HourPreferenceDto {
        return new HourPreferenceDto(this.type, timePeriod)
    }

    setStartTime(newStart: TimeDto) {
        this.timePeriod.start = newStart
    }

    setFinishTime(newFinish: TimeDto) {
        this.timePeriod.finish = newFinish
    }

    copy(): HourPreferenceDto {
        return new HourPreferenceDto(this.type, this.timePeriod.copy())
    }

}