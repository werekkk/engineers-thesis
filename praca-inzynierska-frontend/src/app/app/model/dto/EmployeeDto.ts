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

    static compare = (a: EmployeeDto, b: EmployeeDto) => {
        let c = a.account.lastName.localeCompare(b.account.lastName)
        return c != 0 ? c : a.account.firstName.localeCompare(b.account.firstName)
    }
}