package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.entity.Shift

data class StatisticsPositionYearDto(
        val position: PositionDto,
        val months: List<StatisticsDto> = Array(12) {StatisticsDto(it)}.toList(),
        val total: StatisticsDto = StatisticsDto(null)
) {

    fun add(shift: Shift) {
        val month = shift.period.start.monthValue - 1
        months[month] += shift
        total += shift
    }

}