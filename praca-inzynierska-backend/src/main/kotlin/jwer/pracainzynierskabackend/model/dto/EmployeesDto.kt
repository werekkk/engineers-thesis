package jwer.pracainzynierskabackend.model.dto

data class EmployeesDto(
        val employees: List<EmployeeDto>,
        val employer: AccountDto
)