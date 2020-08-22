package jwer.pracainzynierskabackend.model.dto

import java.time.LocalDate

data class GeneratorConfigDto(
        val employees: List<EmployeeDto>,
        val positions: List<PositionDto>,
        val firstDay: LocalDate,
        val lastDay: LocalDate
)