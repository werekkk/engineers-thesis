package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Employee
import jwer.schedulegenerator.generator.model.PreferenceType
import jwer.schedulegenerator.generator.model.Schedule
import java.io.File
import kotlin.random.Random

class RandomScheduleGenerator {

    companion object {

        fun generate(config: GeneratorConfig): Schedule {
            val schedule = Schedule(config)

            schedule.schedule.forEachIndexed { i, arr ->
                val emp = schedule.scheduleIndexToEmployee[i]!!
                arr.forEachIndexed { j, _ -> arr[j] = emp.randomPosition()?.id }
            }
            schedule.recalcHourCount()
            return schedule
        }

    }

}