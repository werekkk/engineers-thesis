import { PreferenceType } from '../../PreferenceType'
import { TimePeriod } from '../../TimePeriod'
import { HourPreferenceDto } from '../HourPreferenceDto'

/**
 * Corresponds with the `HourPreferenceDto` class in the backend application.
 */
export class HourPreferenceBackendDto {

    constructor(
        public type: PreferenceType,
        public timePeriod: TimePeriod
    ) {}

    static of(hp: HourPreferenceDto): HourPreferenceBackendDto {
        return new HourPreferenceBackendDto(
            hp.type,
            TimePeriod.of(hp.timePeriod)
        )
    }

}