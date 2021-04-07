package jwer.backend.model.dto

data class ChangeAccountDetailsDto(
        val newEmail: String,
        val newFirstName: String,
        val newLastName: String
){

    fun isValid(): Boolean {
        return newEmail.length in 3..50 &&
                newFirstName.length in 2..50 &&
                newLastName.length in 2..50
    }

}