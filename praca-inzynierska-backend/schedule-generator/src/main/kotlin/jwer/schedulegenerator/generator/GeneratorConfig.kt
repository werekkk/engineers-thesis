package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Employee
import jwer.schedulegenerator.generator.model.Position
import jwer.schedulegenerator.generator.model.Schedule
import kotlinx.serialization.Serializable


class GeneratorConfig(
        employees: List<Employee>,
        val positions: List<Position>,
        val days: Int,
        val timePointsPerDay: Int
) {

    val employees = employees.map { e -> e.filterPositions(positions)}

    val totalTimePoints get() = days * timePointsPerDay

    init {
        if (!(days in 1..30 && timePointsPerDay in 1..288
            && !employees.any { e -> !e.isCorrect(days, timePointsPerDay) }
            && !positions.any { p -> !p.isCorrect(days, timePointsPerDay)})) {
            throw Exception("Generator config initialized with incorrect data!")
        }
    }

    fun withScheduleToString(schedule: Schedule): String {
        return "Schedule:\n${schedule}\nPositions:\n" +
                positions.joinToString( "\n", transform = { p ->
                    var assignedHours = 0
                    schedule.schedule.forEach { entry -> assignedHours += entry.count { h -> h == p.id } }
                    val requiredHours = p.staffRequirements.reduce { acc, i -> acc + i }
                    "${p.id}: ${assignedHours}/${requiredHours}, Redundant hours: ${p.countHours(schedule).redundantHours}"
        } ) + "\nRedundant hours: ${schedule.hourCount.redundantHours}"
    }

    fun createEmployeesByPositionMap(): Map<Long, List<Employee>> {
        val map = HashMap<Long, List<Employee>>()
        positions.forEach {
            map[it.id] = employees.filter { e -> e.positions.any { p -> p.id == it.id } }
        }
        return map
    }
}

