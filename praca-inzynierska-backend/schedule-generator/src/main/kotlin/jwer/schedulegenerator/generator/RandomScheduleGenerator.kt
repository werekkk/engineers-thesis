package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Employee
import jwer.schedulegenerator.generator.model.PreferenceType
import jwer.schedulegenerator.generator.model.Schedule
import kotlin.random.Random

class RandomScheduleGenerator {

    companion object {

        fun generate(config: GeneratorConfig): Schedule {
            val schedule = HashMap<Employee, Array<Long?>>()
            val timePoints = config.timePointsPerDay * config.days
            config.employees.forEach { e ->
                schedule[e] = Array(timePoints) { e.randomPosition()?.id ?: 0 } }
            return Schedule(schedule.mapKeys { k -> k.key.id }, config)
        }

    }

}