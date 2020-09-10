import { AccountDto } from './AccountDto'
import { EmployeeStatus } from '../EmployeeStatus' 
import { PositionDto } from './PositionDto'

export class EmployeeDto {
    constructor(
        public employeeId: number,
        public account: AccountDto,
        public employeeStatus: EmployeeStatus,
        public positions: PositionDto[],
        public invitationToken: string
    ) {}
}