package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Employee
import jwer.schedulegenerator.generator.model.PreferenceType
import jwer.schedulegenerator.generator.model.Schedule

class ConstraintedRandomScheduleGenerator {

    companion object {

        fun generate(config: GeneratorConfig): Schedule {
            val schedule = HashMap<Employee, Array<Long?>>()
            val timePoints = config.timePointsPerDay * config.days
            config.employees.forEach { e -> schedule[e] = Array(timePoints) { null } }
            config.positions.forEach { p ->
                val employeesWithPosition = config.employees.filter { e -> e.positions.any { it.id == p.id } }
                repeat(timePoints) { i ->
                    val availableEmployees = employeesWithPosition.filter { e -> e.preferences[i] != PreferenceType.UNAVAILABLE && schedule[e]!![i] == null }
                    val requiredEmployees = p.staffRequirements[i]
                    availableEmployees.shuffled().subList(0, minOf(requiredEmployees, availableEmployees.size)).forEach { e ->
                        schedule[e]!![i] = p.id
                    }
                }
            }
            return Schedule(schedule.mapKeys { k -> k.key.id }, config)
        }

    }

}