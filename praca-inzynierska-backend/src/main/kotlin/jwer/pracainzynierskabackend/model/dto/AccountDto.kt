package jwer.pracainzynierskabackend.model.dto

import jwer.pracainzynierskabackend.model.auth.Account
import jwer.pracainzynierskabackend.model.auth.AccountType
import jwer.pracainzynierskabackend.model.auth.Credentials

data class AccountDto(
        val username: String?,
        val email: String?,
        val firstName: String,
        val middleName: String?,
        val lastName: String,
        val accountType: AccountType
) {
    constructor(c: Credentials, a: Account) : this(
            c.username,
            c.email,
            a.firstName,
            a.middleName,
            a.lastName,
            a.accountType
    )

    constructor(a: Account, t: AccountType) : this(
            null,
            null,
            a.firstName,
            a.middleName,
            a.lastName,
            t
    )
}