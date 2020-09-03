package jwer.schedulegenerator.generator.utils

import kotlin.random.Random

class RandomSelector<T>(
        private val items: List<T>,
        probabilities: List<Int>
) {

    private val probabilityBoundaries: ArrayList<Int> = ArrayList()

    init {
        probabilities.forEach { probabilityBoundaries.add((probabilityBoundaries.lastOrNull() ?: 0) + it) }
    }

    fun getRandom(): T {
        if (items.isEmpty()) {
            throw NoSuchElementException()
        } else {
            val r = Random.nextInt(probabilityBoundaries.last())
            probabilityBoundaries.forEachIndexed { index, i ->
                if (r < i) return items[index]
            }
        }
        throw IllegalStateException()
    }

}