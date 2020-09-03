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

fun LocalDateTime.isMidnight(): Boolean {
    return hour == 0 && minute == 0 && second == 0
}