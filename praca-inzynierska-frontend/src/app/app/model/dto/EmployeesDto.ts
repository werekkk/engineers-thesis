import { EmployeeDto } from './EmployeeDto';
import { AccountDto } from './AccountDto';

export class EmployeesDto {
    constructor(
        public employees: EmployeeDto[],
        public employer: AccountDto
    ) {}
}