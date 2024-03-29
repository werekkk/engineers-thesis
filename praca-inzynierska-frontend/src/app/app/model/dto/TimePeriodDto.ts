import { TimeDto } from './TimeDto';
import { TimePeriod } from './backend/TimePeriod'

export class TimePeriodDto {
  
    constructor(
        public start: TimeDto,
        public finish: TimeDto 
    ) {
        if (start.toSeconds() > finish.toSeconds()) {
            this.finish = start
            this.start = finish
        }
    }
    
    overlaps(other: TimePeriodDto): boolean {
        return other.start.toSeconds() < this.finish.toSeconds() 
        && this.start.toSeconds() < other.finish.toSeconds()
    }

    seconds(): number {
        return this.finish.toSeconds() - this.start.toSeconds()
    }

    hours(): number {
        return this.seconds() / 3600
    }

    compare(other: TimePeriodDto): number {
        return this.start.toSeconds() - other.start.toSeconds() || this.finish.toSeconds() - other.finish.toSeconds()
    }

    copy(): TimePeriodDto {
        return new TimePeriodDto(this.start.copy(), this.finish.copy())
    }

    static of(timePeriod: TimePeriod): TimePeriodDto {
        if (timePeriod) {
            return new TimePeriodDto(TimeDto.of(timePeriod.start), TimeDto.of(timePeriod.finish))
        } else {
            return null
        }
    }

    static default(): TimePeriodDto {
        let defaultTimePeriod = new TimePeriodDto(new TimeDto(8, 0), new TimeDto(16, 0))
        return defaultTimePeriod
    }
    
}