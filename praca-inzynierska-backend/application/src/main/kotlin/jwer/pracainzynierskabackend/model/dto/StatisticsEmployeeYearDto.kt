package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.Shift

data class StatisticsEmployeeYearDto(
        val employee: EmployeeDto,
        val totalMonths: List<StatisticsDto> =
                Array(12) {StatisticsDto(it)}.toList(),
        val positions: List<StatisticsPositionYearDto> =
                employee.positions.map { StatisticsPositionYearDto(it) },
        val total: StatisticsDto = StatisticsDto(null)
) {

    fun add(shift: Shift) {
        val month = shift.period.start.monthValue - 1
        totalMonths[month] += shift
        positions.find { it.position.id == shift.position.id }?.let {it.add(shift)}
        total += shift
    }

}