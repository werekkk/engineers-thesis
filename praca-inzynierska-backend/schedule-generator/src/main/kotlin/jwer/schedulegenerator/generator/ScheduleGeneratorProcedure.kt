package jwer.schedulegenerator.generator

import jwer.schedulegenerator.generator.model.GeneratorConfig
import jwer.schedulegenerator.generator.model.Schedule
import jwer.schedulegenerator.generator.transition.ShiftTakeoverTransition
import jwer.schedulegenerator.generator.transition.SingleBlockChangeTransition
import jwer.schedulegenerator.generator.transition.Transition
import jwer.schedulegenerator.generator.utils.RandomScheduleGenerator
import jwer.schedulegenerator.generator.utils.RandomSelector
import jwer.schedulegenerator.generator.utils.SerializableGeneratorConfig
import jwer.schedulegenerator.generator.utils.standardDeviation
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.io.File
import kotlin.math.exp
import kotlin.math.pow
import kotlin.math.roundToInt
import kotlin.random.Random

private const val W_REDUNDANT_HOURS = 20.0
private const val W_UNASSIGNED_HOURS = 20.0
private const val W_SHIFTS = 16.0
private const val W_HOUR_COUNT_STANDARD_DEVIATION = 1.0
private const val W_UNAVAILABLE_HOURS = 30.0
private const val W_UNWILLING_HOURS = 10.0
private const val W_AVAILABLE_HOURS = 4.0
private const val W_WILLING_HOURS = 0.0

private const val ITERATIONS = 3000000

private const val TEMP_START: Double = 9.7
private const val TEMP_FINAL: Double = 0.1

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

    if (log) println("Initial cost: $cost")

    var it = 0
    var lastPercent = 0
    var previousCheckCost: Double = -1.0
    while (temperature >= tempFinal) {
        if (log && (100.0 * it / iterations) >= lastPercent) {
            schedule.recalculateHourCount()
            if (cost != cost(schedule)) {
                println("COST CALCULATION ERROR! \\/")
            }
            println("${(100.0 * it / iterations).roundToInt()}%, current cost: $cost")
            lastPercent += 5
            if (cost == previousCheckCost) {
                return schedule
            }
            previousCheckCost = cost
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
    if (log) println("Final cost: $cost")
    if (log) println("Generation finished in ${System.currentTimeMillis() - time} ms")
    return schedule
}

fun cost(schedule: Schedule): Double {
    val hourCount = schedule.hourCount
    return hourCount.redundantHours * W_REDUNDANT_HOURS +
    hourCount.unassignedHours * W_UNASSIGNED_HOURS +
    hourCount.shifts * W_SHIFTS +
    hourCount.hoursByEmployee.standardDeviation() * W_HOUR_COUNT_STANDARD_DEVIATION +
    hourCount.unavailableHours * W_UNAVAILABLE_HOURS +
    hourCount.unwillingHours * W_UNWILLING_HOURS +
    hourCount.availableHours * W_AVAILABLE_HOURS +
    hourCount.willingHours * W_WILLING_HOURS
}

private val transitionSelector: RandomSelector<(Schedule) -> Transition> = RandomSelector(
        listOf(
                {s -> SingleBlockChangeTransition.randomFrom(s)},
                {s -> ShiftTakeoverTransition.randomFrom(s)}
        ), listOf(99, 1)
)

private fun createTransition(schedule: Schedule): Transition {
    if (schedule.positionsWithPossibleTakeovers.isEmpty()) return SingleBlockChangeTransition.randomFrom(schedule)
    return transitionSelector.getRandom().invoke(schedule)
}


fun findOptimalTemperatures() {
    println("tempFinish;tempStart;costMin;costMax;costAvg")
    val config = Json.decodeFromString<SerializableGeneratorConfig>(
            File("sprzatajacy.json").readText()
    ).toConfig()
    val tempFinal = 0.1
    val multiplier = 1.1
    var tempStart = tempFinal * multiplier
    while (tempStart < 100000) {
        val deferred = (1..20).map {
            GlobalScope.async {
                cost(sa(config, tempStart = tempStart, tempFinal = tempFinal, log = false))
            }
        }
        runBlocking {
            var costs = deferred.map { it.await() }
            println("${tempFinal};${tempStart};${costs.sorted()[0]};${costs.sortedDescending()[0]};${costs.average()}")
        }
        tempStart *= multiplier
    }
}