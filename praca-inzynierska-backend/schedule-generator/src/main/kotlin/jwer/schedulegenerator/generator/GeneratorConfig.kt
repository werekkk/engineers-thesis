package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Employee
import jwer.schedulegenerator.generator.model.Position
import jwer.schedulegenerator.generator.model.Schedule

class GeneratorConfig(
        employees: List<Employee>,
        val positions: List<Position>,
        val days: Int,
        val timePointsPerDay: Int,
        val shortestShift: Int = 1
) {

    val employees = employees.map { e -> e.filterPositions(positions)}

    init {
        if (!(days in 1..14 && timePointsPerDay in 1..288 && shortestShift in 1..timePointsPerDay
            && !employees.any { e -> !e.isCorrect(days, timePointsPerDay) }
            && !positions.any { p -> !p.isCorrect(days, timePointsPerDay)})) {
            throw Exception("Generator config initialized with incorrect data!")
        }
    }

    fun withScheduleToString(schedule: Schedule): String {
        return "Schedule:\n${schedule}\nPositions:\n" +
                positions.joinToString( "\n", transform = { p ->
                    var assignedHours = 0
                    schedule.employeeSchedule.forEach { entry -> assignedHours += entry.value.count { h -> h == p.id } }
                    val requiredHours = p.staffRequirements.reduce { acc, i -> acc + i }
                    "${p.id}: ${assignedHours}/${requiredHours}, Redundant hours: ${p.countRedundantHours(schedule)}"
        } ) + "\nRedundant hours: ${schedule.countRedundantHours(this)}"
    }
}