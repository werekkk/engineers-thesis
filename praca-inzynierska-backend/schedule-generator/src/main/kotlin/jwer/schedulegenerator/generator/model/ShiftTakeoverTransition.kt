package jwer.schedulegenerator.generator.model

import jwer.schedulegenerator.generator.utils.findAllShiftsByPosition

class ShiftTakeoverTransition(
        private val sourceEmp: Int,
        private val destinationEmp: Int,
        private val start: Int,
        private val end: Int,
        schedule: Schedule
) : Transition {

    private lateinit var hourCountBeforeTransition: HourCount
    private lateinit var hourCountAfterTransition: HourCount

    private val sourceOriginalShift: Array<Long?>? =
            if (isValid()) Array(end - start + 1) { schedule.schedule[sourceEmp][start + it] } else null
    private val destinationOriginalShift: Array<Long?>? =
            if (isValid()) Array(end - start + 1) { schedule.schedule[destinationEmp][start + it] } else null

    companion object {

        fun randomFrom(schedule: Schedule): ShiftTakeoverTransition {
            val position = schedule.positionsWithPossibleTakeovers.random()
            val employees = schedule.employeesByPosition[position]!!
            val selectedEmployees = employees.shuffled().subList(0, 2).map { schedule.employeeToScheduleIndex[it]!! }
            val shift = findShift(schedule, selectedEmployees[0], position)
            return ShiftTakeoverTransition(
                    selectedEmployees[0],
                    selectedEmployees[1],
                    shift?.first ?: -1,
                    shift?.second ?: -1,
                    schedule
            )
        }

        private fun findShift(schedule: Schedule, employee: Int, position: Long): Pair<Int, Int>? {
            return schedule.schedule[employee]
                    .findAllShiftsByPosition(position)
                    .randomOrNull()
        }

    }

    override fun applyToSchedule(schedule: Schedule) {
        if (isValid()) {
            hourCountBeforeTransition = schedule.hourCountOnPeriod(start, end)
            for (i in start..end) {
                schedule.schedule[sourceEmp][i] = null
                schedule.schedule[destinationEmp][i] = sourceOriginalShift!![i - start]
            }
            hourCountAfterTransition = schedule.hourCountOnPeriod(start, end)
            schedule.hourCount -= hourCountBeforeTransition
            schedule.hourCount += hourCountAfterTransition
        }
    }

    override fun revertFromSchedule(schedule: Schedule) {
        if (isValid()) {
            for (i in start..end) {
                schedule.schedule[sourceEmp][i] = sourceOriginalShift!![i - start]
                schedule.schedule[destinationEmp][i] = destinationOriginalShift!![i - start]
            }
            schedule.hourCount -= hourCountAfterTransition
            schedule.hourCount += hourCountBeforeTransition
        }
    }

    fun isValid(): Boolean {
        return start >= 0 && end >= 0 && sourceEmp >= 0 && destinationEmp >= 0
    }

}