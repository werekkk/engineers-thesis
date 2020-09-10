package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.auth.AccountType
import jwer.pracainzynierskabackend.model.entity.Employee
import jwer.pracainzynierskabackend.model.entity.EmployeeStatus
import java.time.LocalDate

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