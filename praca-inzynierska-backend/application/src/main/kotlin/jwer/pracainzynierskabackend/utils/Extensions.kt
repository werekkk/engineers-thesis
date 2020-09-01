package jwer.pracainzynierskabackend.utils

import java.time.LocalDateTime

fun LocalDateTime.totalMinutesInDay(): Int {
    if (isSavedAsMidnight()) {
        return 24 * 60
    } else {
        return hour * 60 + minute
    }
}

fun LocalDateTime.isSavedAsMidnight(): Boolean {
    return hour == 23 && minute == 59 && second == 59
}

fun LocalDateTime.isMidnigtht(): Boolean {
    return hour == 0 && minute == 0 && second == 0
}

fun <K, V> List<V>.toMap(extractKey: (V) -> K): Map<K, V> {
    val map = HashMap<K, V>()
    forEach { elem -> map[extractKey(elem)] = elem }
    return map
}