package jwer.pracainzynierskabackend.model.dto

data class RegisterWorkplaceDetailsDto(
        val employer: RegisterAccountDetailsDto,
        val workplaceName: String
) {
}