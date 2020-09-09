package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.TimePointArray
import jwer.pracainzynierskabackend.model.entity.ShiftType
import jwer.pracainzynierskabackend.utils.isMidnight
import jwer.schedulegenerator.generator.model.Schedule
import java.time.LocalDate

data class ShiftsDto(
        val shifts: List<ShiftDto> = listOf()
) {

    companion object {

        fun fromGeneratedSchedule(schedule: Schedule, startDate: LocalDate): ShiftsDto {
            val shifts = mutableListOf<ShiftDto>()
            schedule.schedule.mapIndexed{ i, arr -> Pair(schedule.scheduleIndexToEmployee[i]!!.id, arr)}.forEach { (empId, array) ->
                var posStart = 0
                array.forEachIndexed { i, posId ->
                    if (array[i] != array[posStart]) {
                        if (array[posStart] != null && array[posStart] != 0L) {
                            shifts.add(newShift(posStart, i, startDate, empId, array[posStart]!!))
                        }
                        posStart = i
                    }
                }
                if (array[posStart] != null && array[posStart] != 0L) {
                    shifts.add(newShift(posStart, array.size, startDate, empId, array[posStart]!!))
                }
            }
            return ShiftsDto(shifts.sortedBy { it.start })
        }

        private inline fun newShift(start: Int, finish: Int, startDate: LocalDate, empId: Long, posId: Long): ShiftDto {
            val startTime = TimePointArray.timePointToDate(startDate, start)
            var finishTime = TimePointArray.timePointToDate(startDate, finish)
            if (finishTime.isMidnight()) {
                finishTime = finishTime.minusSeconds(1)
            }
            return ShiftDto(0, empId, posId, startTime, finishTime, null, ShiftType.GENERATED)
        }
    }
}