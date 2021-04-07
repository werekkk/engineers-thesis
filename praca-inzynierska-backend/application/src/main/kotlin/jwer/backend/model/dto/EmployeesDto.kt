package jwer.backend.model.dto

data class EmployeesDto(
        val employees: List<EmployeeDto>,
        val employer: AccountDto
)