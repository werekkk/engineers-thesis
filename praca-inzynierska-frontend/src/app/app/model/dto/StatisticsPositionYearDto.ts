import { PositionDto } from './PositionDto';
import { StatisticsDto } from './StatisticsDto';
import { StatisticsEmployeeYearDto } from './StatisticsEmployeeYearDto';

export class StatisticsPositionYearDto {

    constructor(
        public position: PositionDto,
        public employees: StatisticsEmployeeYearDto[],
        public totalMonths: StatisticsDto[],
        public total: StatisticsDto
    ) {}

    static copyOf(other: StatisticsPositionYearDto): StatisticsPositionYearDto {
        return new StatisticsPositionYearDto(other.position, other.employees.map(e => StatisticsEmployeeYearDto.copyOf(e)),other.totalMonths.map(m => StatisticsDto.copyOf(m)), StatisticsDto.copyOf(other.total))
    }

}