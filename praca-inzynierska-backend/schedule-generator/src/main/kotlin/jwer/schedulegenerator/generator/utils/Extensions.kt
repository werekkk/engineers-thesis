package jwer.schedulegenerator.generator.utils

import kotlin.math.pow
import kotlin.math.sqrt

fun Long?.isTruthy(): Boolean {
    return this != null && this != 0L
}

fun Array<Long?>.findAllShiftsByPosition(position: Long): List<Pair<Int, Int>> {
    var previous: Long? = null
    var currentStart: Int? = null
    var pairs: ArrayList<Pair<Int, Int>> = ArrayList()
    forEachIndexed { i, it ->
        if (it != previous) {
            if (it == position) {
                currentStart = i
            } else if (previous == position) {
                pairs.add(Pair(currentStart!!, i-1))
            }
        }
        previous = it
    }
    if (last() == position) {
        pairs.add(Pair(currentStart!!, size - 1))
    }
    return pairs
}

fun Array<out Int>.standardDeviation(): Double {
    return sqrt((map { it * it }.sum().toDouble() / size) - (average().pow(2)))
}