package jwer.schedulegenerator.generator.transition

import jwer.schedulegenerator.generator.model.Schedule

interface Transition {

    fun applyToSchedule(schedule: Schedule)
    fun revertFromSchedule(schedule: Schedule)

}