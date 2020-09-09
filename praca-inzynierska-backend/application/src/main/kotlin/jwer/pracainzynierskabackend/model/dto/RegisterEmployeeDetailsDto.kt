package jwer.pracainzynierskabackend.model.dto

data class RegisterEmployeeDetailsDto(
        val username: String,
        val password: String,
        val email: String,
        val invitationToken: String
) {

    fun isValid(): Boolean {
        return username.length in 3..20 &&
                password.length in 4..20 &&
                email.length in 3..50
    }

}