package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Schedule

private val W_REDUNDANT_HOURS = 1000L
private val W_UNASSIGNED_HOURS = 1000L

fun SA(config: GeneratorConfig): Schedule {
    var currentSchedule = RandomScheduleGenerator.generate(config)
    return currentSchedule
}

fun cost(schedule: Schedule, config: GeneratorConfig): Long {
    return schedule.countRedundantHours(config) * W_REDUNDANT_HOURS
    + schedule.countUnassignedHours(config) * W_UNASSIGNED_HOURS
}

