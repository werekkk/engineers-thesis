package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.Schedule
import jwer.schedulegenerator.generator.model.SingleBlockChangeTransition
import jwer.schedulegenerator.generator.model.Transition
import kotlin.math.exp
import kotlin.math.pow
import kotlin.math.roundToInt
import kotlin.random.Random

private val W_REDUNDANT_HOURS = 10L
private val W_UNASSIGNED_HOURS = 10L
private val W_SHIFTS = 6L

private val ITERATIONS = 5000000

private val TEMP_START: Double = 24.0
private val TEMP_FINAL: Double = 0.75

// http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.589.3061&rep=rep1&type=pdf - strona 5, 3.3
private val E: Double = (TEMP_FINAL / TEMP_START).pow(1.0 / ITERATIONS)

fun sa(config: GeneratorConfig,
       tempStart: Double = TEMP_START,
       tempFinal: Double = TEMP_FINAL,
       iterations: Int = ITERATIONS,
       e: Double = (tempFinal / tempStart).pow(1.0 / iterations),
       log: Boolean = true): Schedule {
    if (log) println("Generation started")
    var time = System.currentTimeMillis()
    var temperature = tempStart

    var schedule = RandomScheduleGenerator.generate(config)
    var cost = cost(schedule)

    if (log) println("Initial cost: ${cost}")

    var it = 0
    var lastPercent = 0
    while (temperature >= tempFinal) {
        if (log && (100.0 * it / iterations) >= lastPercent) {
            println("${(100.0 * it / iterations).roundToInt()}%, current cost: ${cost}")
            lastPercent += 5
        }
        val transition = createTransition(schedule)
        schedule.applyTransition(transition)
        val newCost = cost(schedule)
        val costDiff = newCost - cost
        if (costDiff < 0 || Random.nextDouble(1.0) <= exp(-(costDiff / temperature))) {
            cost = newCost
        } else {
            schedule.revertTransition(transition)
        }
        temperature *= e
        it++
    }
    if (log) println("Final cost: ${cost}")
    if (log) println("Generation finished in ${System.currentTimeMillis() - time} ms")
    return schedule
}

fun cost(schedule: Schedule): Long {
    val hourCount = schedule.hourCount
    return hourCount.redundantHours * W_REDUNDANT_HOURS +
    hourCount.unassignedHours * W_UNASSIGNED_HOURS +
    hourCount.shifts * W_SHIFTS
}

private fun createTransition(schedule: Schedule): Transition {
    return SingleBlockChangeTransition.randomFrom(schedule)
}