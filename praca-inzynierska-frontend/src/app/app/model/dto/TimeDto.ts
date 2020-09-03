import * as moment from 'moment'

export class TimeDto {   

    constructor(
        public hour: number,
        public minute: number,
        public second: number = 0
    ) {
        
    }

    static of(timeString: string): TimeDto {
        if (!timeString) {
            return null
        } else {
            let elems = timeString.split(':')
            if (elems[0] === '23' && elems[1] === '59' && elems[2] === '59') {
                return new TimeDto(24, 0, 0)
            } else {
                return new TimeDto(+elems[0], +elems[1], +elems[2])
            }
        }
    }

    static fromDate(date: Date): TimeDto {
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        if (hours == 23 && minutes == 59 && seconds == 59) {
            return new TimeDto(24, 0, 0)
        } else {
            return new TimeDto(hours, minutes, seconds)
        }
    }

    toString(): string {
        if (this.isMidnight()) {
            return '23:59:59'
        } else {
            return `${this.hour<10?0:''}${this.hour}:${this.minute<10?0:''}${this.minute}:${this.second<10?0:''}${this.second}`
        }
    }

    toHHMMString(): string {
        return `${this.hour}:${this.minute<10?0:''}${this.minute}`
    }

    toDisplayHHMMString(): string {
        return this.isMidnight() ? '24:00' : this.toHHMMString()
    }

    toDayPercentage(): number {
        return this.toSeconds() / 86400
    }

    toSeconds(): number {
        return this.isMidnight() ? 86400 : (this.hour * 3600) + (this.minute * 60) + this.second
    }

    equals(other: TimeDto): boolean {
        return (other) && (this.hour == other.hour && this.minute == other.minute && this.second == other.second)
    }

    isMidnight() {
        return this.hour == 24 && this.minute == 0 && this.second == 0
    }

    createDateTime(date: Date): Date {
        if (this.isMidnight()) {
            return moment(date).hour(23).minute(59).second(59).millisecond(0).toDate()
        } else {
            return moment(date).hour(this.hour).minute(this.minute).second(this.second).millisecond(0).toDate()
        }
    }

    copy(): TimeDto {
        return new TimeDto(this.hour, this.minute, this.second)
    }
}