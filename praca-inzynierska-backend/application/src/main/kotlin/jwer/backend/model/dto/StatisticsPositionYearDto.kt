package jwer.backend.model.dto

import jwer.backend.model.entity.Shift

data class StatisticsPositionYearDto(
        val position: PositionDto,
        val employees: List<StatisticsEmployeeYearDto> = listOf(),
        val totalMonths: List<StatisticsDto> = Array(12) {StatisticsDto(it)}.toList(),
        val total: StatisticsDto = StatisticsDto(null)
) {

    fun add(shift: Shift) {
        val month = shift.period.start.monthValue - 1
        totalMonths[month] += shift
        total += shift
        employees.find { it.employee.employeeId == shift.employee.id }?.add(shift)
    }

}