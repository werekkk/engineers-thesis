package jwer.schedulegenerator.generator.utils

import jwer.schedulegenerator.generator.model.GeneratorConfig
import jwer.schedulegenerator.generator.model.Schedule

class RandomScheduleGenerator {

    companion object {

        fun generate(config: GeneratorConfig): Schedule {
            val schedule = Schedule(config)

            schedule.schedule.forEachIndexed { i, arr ->
                val emp = schedule.scheduleIndexToEmployee[i]!!
                arr.forEachIndexed { j, _ -> arr[j] = emp.randomPosition()?.id }
            }
            schedule.recalculateHourCount()
            return schedule
        }

    }

}