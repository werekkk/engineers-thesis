import { EmployeeStatus } from '../EmployeeStatus'

export class AddEmployeeDto {
    constructor( 
        public firstName: string,
        public lastName: string
    ) {}
}