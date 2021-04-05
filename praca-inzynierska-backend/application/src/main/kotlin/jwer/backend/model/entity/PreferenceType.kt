package jwer.backend.model.entity

import jwer.schedulegenerator.generator.model.PreferenceType

enum class PreferenceType {
    WILLING,
    AVAILABLE,
    UNWILLING,
    UNAVAILABLE;

    companion object {

        fun fromNumber(number: Int): PreferenceType? {
            return when (number) {
                0 -> PreferenceType.UNAVAILABLE
                1 -> PreferenceType.UNWILLING
                2 -> PreferenceType.AVAILABLE
                3 -> PreferenceType.WILLING
                else -> null
            }
        }
    }

    fun toNumber(): Int {
        return when (this) {
            UNAVAILABLE -> 0
            UNWILLING -> 1
            AVAILABLE -> 2
            WILLING -> 3
        }
    }

}