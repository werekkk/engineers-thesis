package jwer.schedulegenerator.generator.model

interface Transition {

    fun applyToSchedule(schedule: Schedule)
    fun revertFromSchedule(schedule: Schedule)

}