package jwer.schedulegenerator.generator.utils

fun Long?.isTruthy(): Boolean {
    return this != null && this != 0L
}