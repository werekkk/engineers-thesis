import { TimePeriodDto } from './dto/TimePeriodDto';

export class TimePeriod {
    constructor(
        public start: string,
        public finish: string
    ) {}

    static of(timePeriod: TimePeriodDto): TimePeriod {
        if (timePeriod) {
            return new TimePeriod(timePeriod.start.toString(), timePeriod.finish.toString())
        } else {
            return null
        }
    }
}