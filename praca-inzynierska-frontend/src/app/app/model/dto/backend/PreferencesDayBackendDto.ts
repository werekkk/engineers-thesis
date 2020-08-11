import { HourPreferenceBackendDto } from './HourPreferenceBackendDto';
import { PreferencesDayDto } from '../PreferencesDayDto';


/**
 * Corresponds with the `PreferencesDayDto` class in the backend application.
 */
export class PreferencesDayBackendDto {

    constructor(
        public preferences: HourPreferenceBackendDto[]
    ) {}

    static of(pd: PreferencesDayDto): PreferencesDayBackendDto {
        return new PreferencesDayBackendDto(pd.preferences.map(hp => HourPreferenceBackendDto.of(hp)))
    }

}