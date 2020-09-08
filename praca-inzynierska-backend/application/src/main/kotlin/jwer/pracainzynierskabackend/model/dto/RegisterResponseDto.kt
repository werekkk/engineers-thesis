package jwer.pracainzynierskabackend.model.dto

data class RegisterResponseDto(
        val error: RegisterError? = null,
        val account: AccountDto? = null
)