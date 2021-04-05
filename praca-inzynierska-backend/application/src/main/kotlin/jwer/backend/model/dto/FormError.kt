package jwer.backend.model.dto

enum class FormError {
    INVALID_FIELDS,
    INVALID_EMAIL,
    USERNAME_TAKEN,
    EMAIL_TAKEN,
    INCORRECT_PASSWORD
}