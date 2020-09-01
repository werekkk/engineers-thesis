package jwer.schedulegenerator.generator.model

import jwer.schedulegenerator.generator.GeneratorConfig
import kotlin.random.Random

/**
 * @param employeeSchedule Generated schedule represented as key-value pairs where
 * the key is the employees id and its value is an array of positions' ids assigned
 * to the employee in the time points included in the schedule. The null value
 * in the array indicates the time off.
 */
data class Schedule(
        val configuration: GeneratorConfig,
        val schedule: Array<Array<Long?>> = Array(configuration.employees.size) { Array(configuration.totalTimePoints) {null} }
) {

    var hourCount = HourCount()

    val scheduleIndexToEmployee = HashMap<Int, Employee>()
    val employeeToScheduleIndex = HashMap<Employee, Int>()

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

    fun isValidWithEmployeePreferences(employees: List<Employee>): Boolean {
        var isValid = true
        schedule.forEachIndexed { empIndex, empSchedule ->
            run {
                val emp = scheduleIndexToEmployee[empIndex]!!
                empSchedule.forEachIndexed { index: Int, l: Long? ->
                    run {
                        if (l != null && l != 0L) {
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
        val hourCount = HourCount()
        configuration.positions.forEach { hourCount += it.countHoursOnPeriod(this, start, finish) }
        return hourCount
    }

    fun recalcHourCount() {
        hourCount = HourCount()
        configuration.positions.forEach { hourCount += it.countHours(this) }
    }
}