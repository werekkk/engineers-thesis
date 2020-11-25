package jwer.schedulegenerator.generator.transition

import jwer.schedulegenerator.generator.model.HourCount
import jwer.schedulegenerator.generator.model.Schedule
import kotlin.random.Random

class SingleBlockChangeTransition(
        private val emp: Int,
        private val timePoint: Int,
        private val previousPosition: Long?,
        private val newPosition: Long?
) : Transition {

    private lateinit var hourCountBeforeTransition: HourCount
    private lateinit var hourCountAfterTransition: HourCount

    companion object {

        fun randomFrom(schedule: Schedule): SingleBlockChangeTransition {
            val emp = Random.nextInt(schedule.schedule.size)
            val timePoint = Random.nextInt(schedule.schedule[emp].size)
            val previousPosition = schedule.schedule[emp][timePoint]
            val currentPosition = schedule.scheduleIndexToEmployee[emp]!!.randomPosition()?.id
            return SingleBlockChangeTransition(emp, timePoint, previousPosition, currentPosition)
        }

    }

    override fun applyToSchedule(schedule: Schedule) {
        hourCountBeforeTransition = schedule.hourCountOnPeriod(timePoint, timePoint)
        schedule.schedule[emp][timePoint] = newPosition
        hourCountAfterTransition = schedule.hourCountOnPeriod(timePoint, timePoint)
        schedule.hourCount -= hourCountBeforeTransition
        schedule.hourCount += hourCountAfterTransition
    }

    override fun revertFromSchedule(schedule: Schedule) {
        schedule.schedule[emp][timePoint] = previousPosition
        schedule.hourCount -= hourCountAfterTransition
        schedule.hourCount += hourCountBeforeTransition
    }

}