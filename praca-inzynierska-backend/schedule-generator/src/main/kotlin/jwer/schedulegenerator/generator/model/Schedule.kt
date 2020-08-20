package jwer.schedulegenerator.generator.model

import jwer.schedulegenerator.generator.GeneratorConfig

/**
 * @param employeeSchedule Generated schedule represented as key-value pairs where
 * the key is the employees id and its value is an array of positions' ids assigned
 * to the employee in the time points included in the schedule. The null value
 * in the array indicates the time off.
 */
data class Schedule(
        val employeeSchedule: Map<Long, Array<Long?>>,
        val configuration: GeneratorConfig
) {

    override fun toString(): String {
        return employeeSchedule.toList().sortedBy { pair -> pair.first }.joinToString("\n", transform = { p ->
            "${p.first}: [${p.second.joinToString("", transform = {l -> l?.toString() ?: "0" })}]"
        } )
    }

    fun isValidWithEmployeePreferences(employees: List<Employee>): Boolean {
        var isValid = true
        val idToEmp = HashMap<Long, Employee>()
        employees.forEach { e -> idToEmp[e.id] = e }
        employeeSchedule.forEach { entry ->
            run {
                val emp = idToEmp[entry.key]!!
                entry.value.forEachIndexed { index: Int, l: Long? ->
                    run {
                        if (l != null) {
                            isValid = isValid && emp.positions.any { p -> p.id == l } && emp.preferences[index] != PreferenceType.UNAVAILABLE
                        }
                    }
                }
            }
        }
        return true
    }

    fun isComplete(config: GeneratorConfig): Boolean {
        return config.positions.map {p ->
            var assignedHours = 0
            employeeSchedule.forEach { entry -> assignedHours += entry.value.count { h -> h == p.id } }
            val requiredHours = p.staffRequirements.reduce { acc, i -> acc + i }
            "${p.id}: ${assignedHours}/${requiredHours}"
            assignedHours == requiredHours
        }.reduce { acc, b -> acc && b }
    }

    fun countRedundantHours(configuration: GeneratorConfig): Int {
        var count = 0
        configuration.positions.forEach { p ->
            count += p.countRedundantHours(this)
        }
        return count
    }

    fun countUnassignedHours(configuration: GeneratorConfig): Int {
        var count = 0
        configuration.positions.forEach { p ->
            count += p.countUnassignedHours(this)
        }
        return count
    }

}