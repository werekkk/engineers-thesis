package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.Shift

data class StatisticsYearDto(
        val year: Int,
        val positionStatistics: List<StatisticsPositionYearDto>,
        val employeeStatistics: List<StatisticsEmployeeYearDto>
) {

    fun add(shift: Shift) {
        val month = shift.period.start.monthValue - 1
        positionStatistics.find { it.position.id == shift.position.id }!!.totalMonths[month] += shift
        employeeStatistics.find { it.employee.employeeId == shift.employee.id }!!.total += shift
    }

}