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

    get firstDayStart(): Date { return moment(this.firstDay).startOf('day').toDate() }
    get lastDayStart(): Date { return moment(this.lastDay).startOf('day').toDate() }

    isDateInPeriod(date: Date): boolean {
        let m = moment(date)
        return !(m.isBefore(this.firstDayStart) || m.isAfter(moment(this.lastDay).endOf('day')))
    }

    static copyOf(other: GeneratorConfigDto): GeneratorConfigDto {
        return new GeneratorConfigDto(other.employees, other.positions, other.firstDay, other.lastDay)
    }

}