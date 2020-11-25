package jwer.schedulegenerator.generator.utils

import jwer.schedulegenerator.generator.model.GeneratorConfig
import jwer.schedulegenerator.generator.model.PreferenceType
import jwer.schedulegenerator.generator.model.Schedule

class ConstrainedRandomScheduleGenerator {

    companion object {

        fun generate(config: GeneratorConfig): Schedule {
            val schedule = Schedule(config)

            config.positions.forEach { p ->
                val employeesWithPosition = config.employees.filter { e -> e.positions.any { it.id == p.id } }
                repeat(config.totalTimePoints) { i ->
                    val availableEmployees = employeesWithPosition.filter { e -> e.preferences[i] != PreferenceType.UNAVAILABLE &&
                            schedule.schedule[schedule.employeeToScheduleIndex[e]!!][i] == null }
                    val requiredEmployees = p.staffRequirements[i]
                    availableEmployees.shuffled().subList(0, minOf(requiredEmployees, availableEmployees.size)).forEach { e ->
                        schedule.schedule[schedule.employeeToScheduleIndex[e]!!][i] = p.id
                    }
                }
            }

            return schedule
        }

    }

}