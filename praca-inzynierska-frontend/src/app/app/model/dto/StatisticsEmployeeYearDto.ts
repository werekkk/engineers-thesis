import { StatisticsDto } from './StatisticsDto';
import { EmployeeDto } from './EmployeeDto';
import { StatisticsPositionYearDto } from './StatisticsPositionYearDto';
import { PositionDto } from './PositionDto';

export class StatisticsEmployeeYearDto {

    constructor(
        public employee: EmployeeDto,
        public totalMonths: StatisticsDto[],
        public positions: StatisticsPositionYearDto[],
        public total: StatisticsDto
    ) {}

    sort() {
        this.positions.sort((a, b) => PositionDto.compare(a.position, b.position))
    }

    static copyOf(other: StatisticsEmployeeYearDto): StatisticsEmployeeYearDto {
        return new StatisticsEmployeeYearDto(
            other.employee, 
            other.totalMonths.map(m => StatisticsDto.copyOf(m)),
            other.positions.map(p => StatisticsPositionYearDto.copyOf(p)),
            StatisticsDto.copyOf(other.total)
        )
    }
}