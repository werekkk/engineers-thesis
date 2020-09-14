package jwer.pracainzynierskabackend.model.dto

data class ChangePasswordDto(
        val oldPassword: String,
        val newPassword: String
)