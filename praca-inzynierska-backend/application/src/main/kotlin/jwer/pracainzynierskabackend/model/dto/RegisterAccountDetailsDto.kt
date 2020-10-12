package jwer.pracainzynierskabackend.model.dto

data class RegisterAccountDetailsDto(
        val username: String,
        val password: String,
        val email: String,

        val firstName: String,
        val lastName: String
) {
}