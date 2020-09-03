package jwer.schedulegenerator.generator.model

class ShiftTakeoverTransition(
        private val sourceEmp: Long,
        private val destinationEmp: Long,
        private val start: Int
) : Transition {

    companion object {

        fun randomFrom(schedule: Schedule): ShiftTakeoverTransition {

            TODO()
        }

    }

    override fun applyToSchedule(schedule: Schedule) {
        TODO("Not yet implemented")
    }

    override fun revertFromSchedule(schedule: Schedule) {
        TODO("Not yet implemented")
    }

}