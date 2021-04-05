package jwer.backend.utils

import java.time.LocalDateTime

fun LocalDateTime.totalMinutesInDay(): Int {
    return if (isSavedAsMidnight()) {
        24 * 60
    } else {
        hour * 60 + minute
    }
}

fun LocalDateTime.isSavedAsMidnight(): Boolean {
    return hour == 23 && minute == 59 && second == 59
}

fun LocalDateTime.isMidnight(): Boolean {
    return hour == 0 && minute == 0 && second == 0
}