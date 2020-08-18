package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.EmployeeStatus
import java.time.LocalDate

data class AddEmployeeDto(
        val firstName: String,
        val middleName: String? = "",
        val lastName: String,

        val employmentDate: LocalDate?,
        val employeeStatus: EmployeeStatus
)