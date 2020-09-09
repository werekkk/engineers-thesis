import { EmployeeDto } from './EmployeeDto'
import { PositionDto } from './PositionDto'
import * as moment from 'moment'

export class GeneratorConfigDto {

    constructor(
        public employees: EmployeeDto[],
        public positions: PositionDto[],
        public firstDay: Date,
        public lastDay: Date
    ) {}

    isDateInPeriod(date: Date): boolean {
        return moment(date).isBetween(moment(this.firstDay).startOf('day'), moment(this.lastDay).endOf('day'))
    }

    static copyOf(other: GeneratorConfigDto): GeneratorConfigDto {
        return new GeneratorConfigDto(other.employees, other.positions, other.firstDay, other.lastDay)
    }

}