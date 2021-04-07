package jwer.backend.model.dto

data class ChangePasswordDto(
        val oldPassword: String,
        val newPassword: String
) {

    fun isValid(): Boolean {
        return newPassword.length in 4..20
    }

}