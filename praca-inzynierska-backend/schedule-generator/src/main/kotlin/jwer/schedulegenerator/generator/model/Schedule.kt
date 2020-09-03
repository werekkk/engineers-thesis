package jwer.schedulegenerator.generator.model

import jwer.schedulegenerator.generator.GeneratorConfig
import jwer.schedulegenerator.generator.utils.isTruthy

class Schedule(
        val configuration: GeneratorConfig,
        val schedule: Array<Array<Long?>> = Array(configuration.employees.size) { Array(configuration.totalTimePoints) {null} }
) {

    var hourCount = HourCount(schedule.size)

    val scheduleIndexToEmployee = HashMap<Int, Employee>()
    val employeeToScheduleIndex = HashMap<Employee, Int>()

    val employeesByPosition: Map<Long, List<Employee>> = configuration.createEmployeesByPositionMap()
    val positionsWithPossibleTakeovers: List<Long> = employeesByPosition.filter { it.value.size >= 2 }.keys.toList()

    init {
        configuration.employees.forEachIndexed { i, e ->
            scheduleIndexToEmployee[i] = e
            employeeToScheduleIndex[e] = i
        }
    }

    override fun toString(): String {
        return scheduleIndexToEmployee.toList().sortedBy { pair -> pair.second.id }.joinToString("\n", transform = { p ->
            "${p.second.id}: [${schedule[p.first].joinToString("", transform = {l -> l?.toString() ?: "0" })}]"
        } )
    }

    fun applyTransition(transition: Transition) {
        transition.applyToSchedule(this)
    }

    fun revertTransition(transition: Transition) {
        transition.revertFromSchedule(this)
    }

    fun isValidWithEmployeePreferences(): Boolean {
        var isValid = true
        schedule.forEachIndexed { empIndex, empSchedule ->
            run {
                val emp = scheduleIndexToEmployee[empIndex]!!
                empSchedule.forEachIndexed { index: Int, l: Long? ->
                    run {
                        if (l.isTruthy()) {
                            isValid = isValid && emp.positions.any { p -> p.id == l } && emp.preferences[index] != PreferenceType.UNAVAILABLE
                        }
                    }
                }
            }
        }
        return isValid
    }

    fun isComplete(config: GeneratorConfig): Boolean {
        return config.positions.map {p ->
            var assignedHours = 0
            schedule.forEach { entry -> assignedHours += entry.count { h -> h == p.id } }
            val requiredHours = p.staffRequirements.reduce { acc, i -> acc + i }
            "${p.id}: ${assignedHours}/${requiredHours}"
            assignedHours == requiredHours
        }.reduce { acc, b -> acc && b }
    }

    fun hourCountOnPeriod(start: Int, finish: Int): HourCount {
        val hourCount = HourCount(schedule.size)
        configuration.positions.forEach { hourCount += it.countHoursOnPeriod(this, start, finish) }
        hourCount.shifts = countShiftsOnPeriod(start, finish)
        hourCount += countEmployeeHoursAndPreferencesOnPeriod(start, finish)
        return hourCount
    }

    fun recalcHourCount() {
        hourCount = HourCount(schedule.size)
        configuration.positions.forEach { hourCount += it.countHours(this) }
        hourCount.shifts = countShiftsOnPeriod(0, configuration.totalTimePoints - 1)
        hourCount += countEmployeeHoursAndPreferencesOnPeriod(0, configuration.totalTimePoints - 1)
    }

    private fun countShiftsOnPeriod(start: Int, finish: Int): Int {
        var shifts = 0
        val rangeStart = if (start > 0) start - 1 else start
        val rangeFinish = if (finish < configuration.totalTimePoints - 1) finish + 1 else finish

        schedule.forEach {
            var currentPosition: Long? = it[rangeStart]
            for (i in rangeStart..rangeFinish) {
                if (it[i] != currentPosition) {
                    if (currentPosition.isTruthy() && !it[i].isTruthy()) shifts++
                    currentPosition = it[i]
                }
            }
            if (currentPosition.isTruthy()) shifts++
        }

        return shifts
    }

    private fun countEmployeeHoursAndPreferencesOnPeriod(start: Int, finish: Int): HourCount {
        val hours: Array<Int> = Array(schedule.size) {0}
        val hourCount = HourCount(schedule.size)
        schedule.forEachIndexed { index, arr ->
            val employee = scheduleIndexToEmployee[index]!!
            for (i in start..finish) {
                if (arr[i].isTruthy()) {
                    hours[index]++
                    when(employee.preferences[i]) {
                        PreferenceType.UNAVAILABLE -> hourCount.unavailableHours++
                        PreferenceType.UNWILLING -> hourCount.unwillingHours++
                        PreferenceType.AVAILABLE -> hourCount.availableHours++
                        PreferenceType.WILLING -> hourCount.willingHours++
                    }
                }
            }
        }
        hourCount.hoursByEmployee = hours
        return hourCount
    }
}