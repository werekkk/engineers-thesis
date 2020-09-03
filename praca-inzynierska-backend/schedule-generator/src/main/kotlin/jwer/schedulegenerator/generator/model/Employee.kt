package jwer.schedulegenerator.generator.model

import kotlinx.serialization.Serializable
import kotlin.random.Random

@Serializable
data class Employee (
        val id: Long,
        val positions: List<Position>,
        val preferences: Array<PreferenceType>
) {
    constructor(id: Long, positions: List<Position>, preferences: Array<Int>):
            this(id, positions, preferences.map { p: Int ->
                PreferenceType.fromNumber(p)!!
            }.toTypedArray())

    fun filterPositions(allowedPositions: List<Position>): Employee {
        return this.copy(positions = positions.filter { allowedPositions.any { p -> p.id == it.id } })
    }

    fun isCorrect(days: Int, timePointsPerDay: Int): Boolean {
        return preferences.size == days*timePointsPerDay
    }

    fun randomPosition(): Position? {
        val pos = Random.nextInt(positions.size + 1)
        return if (pos == positions.size) null else positions[pos]
    }

}