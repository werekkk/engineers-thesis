package jwer.schedulegenerator.generator.model

data class Position (
        val id: Long,
        val staffRequirements: Array<Int>
) {
    fun isCorrect(days: Int, timePointsPerDay: Int): Boolean {
        return staffRequirements.size == days * timePointsPerDay
    }

    fun countRedundantHours(schedule: Schedule): Int {
        var count = 0
        staffRequirements.forEachIndexed { index, r ->
            var assignedHours = 0
            schedule.employeeSchedule.forEach { t, u ->
                if (u[index] == id) assignedHours++
            }
            count += maxOf(0, assignedHours - r)
        }
        return count
    }

    fun countUnassignedHours(schedule: Schedule): Int {
        var count = 0
        staffRequirements.forEachIndexed { index, r ->
            var assignedHours = 0
            schedule.employeeSchedule.forEach { t, u ->
                if (u[index] == id) assignedHours++
            }
            count += maxOf(0, r - assignedHours)
        }
        return count
    }
}