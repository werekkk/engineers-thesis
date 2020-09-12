export class StatisticsDto {

    constructor(
        public monthNumber: number,
        public shifts: number,
        public hours: number
    ) {}

    static copyOf(other: StatisticsDto): StatisticsDto {
        return new StatisticsDto(other.monthNumber, other.shifts, other.hours)
    }

}