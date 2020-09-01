package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Schedule
import jwer.schedulegenerator.generator.model.SingleBlockChangeTransition
import jwer.schedulegenerator.generator.model.Transition
import kotlin.math.exp
import kotlin.math.pow
import kotlin.math.roundToInt
import kotlin.random.Random

private val W_REDUNDANT_HOURS = 1L
private val W_UNASSIGNED_HOURS = 1L

private val ITERATIONS = 3000000

private val TEMP_START: Double = 1.0
private val TEMP_FINAL: Double = 0.1

// http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.589.3061&rep=rep1&type=pdf - strona 5, 3.3
private val E: Double = (TEMP_FINAL / TEMP_START).pow(1.0 / ITERATIONS)

fun sa(config: GeneratorConfig): Schedule {
    println("Generation started")
    var time = System.currentTimeMillis()
    var temperature = TEMP_START

    var schedule = RandomScheduleGenerator.generate(config)
    var cost = cost(schedule)

    println("Initial cost: ${cost}")

    var newCost = 0L

    var it = 0
    var lastPercent = 0
    while (temperature >= TEMP_FINAL) {
        if ((100.0 * it / ITERATIONS) >= lastPercent) {
            println("${(100.0 * it / ITERATIONS).roundToInt()}%")
            lastPercent += 1
        }
        val transition = createTransition(schedule)
        schedule.applyTransition(transition)
        newCost = cost(schedule)
        val costDiff = newCost - cost
        if (costDiff < 0 || Random.nextDouble(1.0) <= exp(-(costDiff / temperature))) {
            cost = newCost
        } else {
            schedule.revertTransition(transition)
        }
        temperature *= E
        it++
    }
    println("100%")
    println("Final cost: ${cost}")
    println("Generation finished in ${System.currentTimeMillis() - time} ms")
    return schedule
}

private fun cost(schedule: Schedule): Long {
    val hourCount = schedule.hourCount
    return hourCount.redundantHours * W_REDUNDANT_HOURS +
    hourCount.unassignedHours * W_UNASSIGNED_HOURS
}

private fun createTransition(schedule: Schedule): Transition {
    return SingleBlockChangeTransition.randomFrom(schedule)
}