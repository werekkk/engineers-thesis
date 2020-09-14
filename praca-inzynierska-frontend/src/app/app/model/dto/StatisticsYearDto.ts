import { EmployeeDto } from './EmployeeDto';
import { PositionDto } from './PositionDto';
import { StatisticsEmployeeYearDto } from './StatisticsEmployeeYearDto';
import { StatisticsPositionYearDto } from './StatisticsPositionYearDto';

export class StatisticsYearDto {

    constructor(
        public year: number,
        public positionStatistics: StatisticsPositionYearDto[],
        public employeeStatistics: StatisticsEmployeeYearDto[]
    ) {}

    sort() {
        this.positionStatistics.sort((a, b) => PositionDto.compare(a.position, b.position))
        this.employeeStatistics.sort((a, b) => EmployeeDto.compare(a.employee, b.employee))
        this.employeeStatistics.forEach(e => e.sort())
    }

    static copyOf(other: StatisticsYearDto): StatisticsYearDto {
        return new StatisticsYearDto(other.year, 
            other.positionStatistics.map(p => StatisticsPositionYearDto.copyOf(p)),
            other.employeeStatistics.map(e => StatisticsEmployeeYearDto.copyOf(e))
        )
    }
}