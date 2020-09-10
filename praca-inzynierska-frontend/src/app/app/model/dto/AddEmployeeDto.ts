import { EmployeeStatus } from '../EmployeeStatus'

export class AddEmployeeDto {
    constructor( 
        public firstName: String,
        public middleName: String,
        public lastName: String
    ) {}
}