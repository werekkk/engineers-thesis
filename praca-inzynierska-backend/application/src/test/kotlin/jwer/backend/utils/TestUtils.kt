package jwer.backend.utils

import jwer.backend.model.auth.Account
import jwer.backend.model.auth.AccountRole
import jwer.backend.model.auth.AccountType
import jwer.backend.model.auth.Credentials
import jwer.backend.model.entity.*
import jwer.backend.repository.*
import java.security.Principal

class TestUtils {

    companion object {

        fun newTestEmployee(
            firstName: String,
            lastName: String,
            workplace: Workplace,
            accountRepository: AccountRepository,
            employeeRepository: EmployeeRepository
        ): Employee {
            return newTestEmployeeWithPositions(
                firstName, lastName, workplace, listOf(), accountRepository, employeeRepository
            )
        }

        fun newTestEmployeeWithPositions(
            firstName: String,
            lastName: String,
            workplace: Workplace,
            positions: List<Position>,
            accountRepository: AccountRepository,
            employeeRepository: EmployeeRepository
        ): Employee {
            val a = Account(0, firstName, lastName, AccountType.EMPLOYEE)
            val savedA = accountRepository.save(a)
            val e = Employee(
                savedA.id,
                savedA,
                workplace,
                positions,
                null,
                EmployeeStatus.INVITED
            )
            return employeeRepository.save(e)
        }

        fun newTestEmployer(
            username: String,
            credentialsRepository: CredentialsRepository,
            employerRepository: EmployerRepository
        ): Employer {
            val a = Account(0, "Jan", "Kowalski", AccountType.EMPLOYER)
            val c = Credentials(0, username, "1234", "$username@a.com", a, mutableListOf())
            c.accountRoles.add(AccountRole(0, c, "EMPLOYER"))
            val savedCreds = credentialsRepository.save(c)
            val w = Workplace(0, "workplace", null, listOf(), listOf())
            val e = Employer(savedCreds.account.id, savedCreds.account, w)
            w.employer = e
            return employerRepository.save(e)
        }

        fun newTestPosition(
            positionName: String,
            workplace: Workplace,
            positionRepository: PositionRepository
        ): Position {
            val p = Position(0, positionName, workplace)
            return positionRepository.save(p)
        }

    }

}