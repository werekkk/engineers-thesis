package jwer.pracainzynierskabackend.model.dto

data class ChangeAccountDetailsDto(
        val newEmail: String?,
        val newFirstName: String?,
        val newLastName: String?
)