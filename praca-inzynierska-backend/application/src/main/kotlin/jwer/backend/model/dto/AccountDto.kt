package jwer.backend.model.dto

import jwer.backend.model.auth.Account
import jwer.backend.model.auth.AccountType
import jwer.backend.model.auth.Credentials

data class AccountDto(
        val username: String?,
        val email: String?,
        val firstName: String,
        val lastName: String,
        val accountType: AccountType
) {
    constructor(c: Credentials, a: Account) : this(
            c.username,
            c.email,
            a.firstName,
            a.lastName,
            a.accountType
    )

    constructor(a: Account, t: AccountType) : this(
            null,
            null,
            a.firstName,
            a.lastName,
            t
    )
}