import { EmployeeDto } from './EmployeeDto'
import { PositionDto } from './PositionDto'

export class GeneratorConfigDto {

    constructor(
        public employees: EmployeeDto[],
        public positions: PositionDto[],
        public firstDay: Date,
        public lastDay: Date
    ) {}

}