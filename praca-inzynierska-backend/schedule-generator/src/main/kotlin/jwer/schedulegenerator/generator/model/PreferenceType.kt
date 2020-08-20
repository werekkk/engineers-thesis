package jwer.schedulegenerator.generator.model

enum class PreferenceType {
    UNAVAILABLE,
    UNWILLING,
    AVAILABLE,
    WILLING;

    companion object {

        fun fromNumber(number: Int): PreferenceType? {
            return when (number) {
                0 -> UNAVAILABLE
                1 -> UNWILLING
                2 -> AVAILABLE
                3 -> WILLING
                else -> null
            }
        }

    }
}