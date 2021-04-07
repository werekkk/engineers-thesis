package jwer.backend.model.dto

data class RegisterWorkplaceDetailsDto(
        val employer: RegisterAccountDetailsDto,
        val workplaceName: String
) {

    fun isValid(): Boolean {
        return employer.username.length in 3..20 &&
                employer.password.length in 4..20 &&
                employer.email.length in 3..50 &&
                employer.firstName.length in 2..50 &&
                employer.lastName.length in 2..50 &&
                workplaceName.length in 3..100
    }

}