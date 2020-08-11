import { PreferenceType } from '../PreferenceType';

export class OneTimeHourPreferenceDto {

    constructor(
        public id: number,
        public type: PreferenceType,
        public start: Date,
        public finish: Date
    ) {}

}