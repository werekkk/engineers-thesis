package jwer.backend.service

import jwer.backend.model.auth.*
import jwer.backend.repository.CredentialsRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

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

    fun userWithUsernameExists(username: String): Boolean {
        return credentialsRepository.findByUsername(username) != null
    }

    fun userWithEmailExists(email: String): Boolean {
        return credentialsRepository.findByEmail(email) != null
    }

}