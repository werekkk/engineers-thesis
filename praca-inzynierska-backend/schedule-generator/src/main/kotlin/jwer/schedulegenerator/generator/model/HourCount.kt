package jwer.schedulegenerator.generator.model

class HourCount(
        employeeCount: Int,
        var unassignedHours: Int = 0,
        var redundantHours: Int = 0,
        var shifts: Int = 0,
        var unavailableHours: Int = 0,
        var unwillingHours: Int = 0,
        var availableHours: Int = 0,
        var willingHours: Int = 0
) {

    var hoursByEmployee: Array<Int> = Array(employeeCount) {0}

    operator fun plusAssign(other: HourCount) {
        unassignedHours += other.unassignedHours
        redundantHours += other.redundantHours
        shifts += other.shifts
        repeat(hoursByEmployee.size) { hoursByEmployee[it] += other.hoursByEmployee[it] }
        unavailableHours += other.unavailableHours
        unwillingHours += other.unwillingHours
        availableHours += other.availableHours
        willingHours += other.willingHours
    }

    operator fun minusAssign(other: HourCount) {
        unassignedHours -= other.unassignedHours
        redundantHours -= other.redundantHours
        shifts -= other.shifts
        repeat(hoursByEmployee.size) { hoursByEmployee[it] -= other.hoursByEmployee[it] }
        unavailableHours -= other.unavailableHours
        unwillingHours -= other.unwillingHours
        availableHours -= other.availableHours
        willingHours -= other.willingHours
    }

}