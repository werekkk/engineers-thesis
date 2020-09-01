package jwer.schedulegenerator.generator.model

data class HourCount(var unassignedHours: Int = 0, var redundantHours: Int = 0) {

    operator fun plusAssign(other: HourCount) {
        unassignedHours += other.unassignedHours
        redundantHours += other.redundantHours
    }

    operator fun minusAssign(other: HourCount) {
        unassignedHours -= other.unassignedHours
        redundantHours -= other.redundantHours
    }

}