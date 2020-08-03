package jwer.pracainzynierskabackend.model.dto

data class RegisterEmployeeDetailsDto(
        val username: String,
        val password: String,
        val email: String,
        val invitationToken: String
)