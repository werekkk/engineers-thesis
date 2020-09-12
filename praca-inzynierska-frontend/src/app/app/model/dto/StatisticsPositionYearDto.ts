import { PositionDto } from './PositionDto';
import { StatisticsDto } from './StatisticsDto';

export class StatisticsPositionYearDto {

    constructor(
        public position: PositionDto,
        public months: StatisticsDto[],
        public total: StatisticsDto
    ) {}

    static copyOf(other: StatisticsPositionYearDto): StatisticsPositionYearDto {
        return new StatisticsPositionYearDto(other.position, other.months.map(m => StatisticsDto.copyOf(m)), StatisticsDto.copyOf(other.total))
    }

}