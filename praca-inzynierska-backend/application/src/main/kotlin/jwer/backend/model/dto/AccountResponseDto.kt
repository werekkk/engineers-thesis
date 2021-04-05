package jwer.backend.model.dto

data class AccountResponseDto(
        val account: AccountDto? = null,
        val error: FormError? = null
)