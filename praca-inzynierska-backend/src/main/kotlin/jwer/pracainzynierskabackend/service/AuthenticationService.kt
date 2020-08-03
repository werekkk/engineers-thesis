package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.auth.*
import jwer.pracainzynierskabackend.model.dto.AccountDto
import jwer.pracainzynierskabackend.model.dto.RegisterWorkplaceDetailsDto
import jwer.pracainzynierskabackend.model.entity.Employer
import jwer.pracainzynierskabackend.model.entity.Workplace
import jwer.pracainzynierskabackend.repository.CredentialsRepository
import jwer.pracainzynierskabackend.repository.EmployerRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.transaction.Transactional

@Service
class AuthenticationService @Autowired constructor(
        private val credentialsRepository: CredentialsRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String?): LoggedUser {
        username!!.let {
            val credentials = credentialsRepository.findByUsername(it)
                    ?: credentialsRepository.findByEmail(it)
                    ?: throw UsernameNotFoundException(username)
            return LoggedUser(credentials)
        }
    }

}