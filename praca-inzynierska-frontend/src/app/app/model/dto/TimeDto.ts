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

    toString(): string {
        if (this.hour == 24 && this.minute == 0 && this.second == 0) {
            return '23:59:59'
        } else {
            return `${this.hour<10?0:''}${this.hour}:${this.minute<10?0:''}${this.minute}:${this.second<10?0:''}${this.second}`
        }
    }

    toHHMMString(): string {
        return `${this.hour}:${this.minute<10?0:''}${this.minute}`
    }

    toDayPercentage(): number {
        return this.toSeconds() / 86400
    }

    toSeconds(): number {
        return (this.hour * 60 * 60) + (this.minute * 60) + this.second
    }

    equals(other: TimeDto): boolean {
        return (other) && (this.hour == other.hour && this.minute == other.minute && this.second == other.second)
    }
}