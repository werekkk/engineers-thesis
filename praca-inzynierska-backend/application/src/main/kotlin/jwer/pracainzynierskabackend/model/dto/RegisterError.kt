package jwer.pracainzynierskabackend.model.dto

enum class RegisterError {
    INVALID_FIELDS,
    INVALID_EMAIL,
    USERNAME_TAKEN,
    EMAIL_TAKEN
}