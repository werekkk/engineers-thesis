package jwer.schedulegenerator.generator.model

import kotlinx.serialization.Serializable

@Serializable
data class Position (
        val id: Long,
        val staffRequirements: Array<Int>
) {

    fun isCorrect(days: Int, timePointsPerDay: Int): Boolean {
        return staffRequirements.size == days * timePointsPerDay
    }

    fun countHours(schedule: Schedule): HourCount {
        return countHoursOnPeriod(schedule, 0, staffRequirements.size - 1)
    }

    fun countHoursOnPeriod(schedule: Schedule, start: Int, finish: Int): HourCount {
        val hourCount = HourCount()
        for (i in start..finish) {
            var assignedHours = 0
            val requiredHours = staffRequirements[i]
            @Suppress("JavaMapForEach") // Performance
            schedule.schedule.forEach { empSchedule ->
                if (empSchedule[i] == id) {
                    assignedHours++
                }
            }
            hourCount.redundantHours += maxOf(0, assignedHours - requiredHours)
            hourCount.unassignedHours += maxOf(0, requiredHours - assignedHours)
        }
        return hourCount
    }
}