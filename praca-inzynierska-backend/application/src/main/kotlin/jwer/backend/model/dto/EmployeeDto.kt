package jwer.backend.model.dto

import jwer.backend.model.auth.AccountType
import jwer.backend.model.entity.Employee
import jwer.backend.model.entity.EmployeeStatus

data class EmployeeDto(
        val employeeId: Long,
        val account: AccountDto,
        val employeeStatus: EmployeeStatus,
        val positions: List<PositionDto>,
        val invitationToken: String?
) {
    constructor(e: Employee) : this(
            e.id,
            AccountDto(e.account, AccountType.EMPLOYEE),
            e.employeeStatus,
            e.positions.map { PositionDto(it.id, it.name) },
            e.invitationToken
    )
}