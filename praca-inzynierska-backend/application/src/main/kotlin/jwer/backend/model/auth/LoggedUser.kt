package jwer.backend.model.auth

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class LoggedUser(private val _credentials: Credentials) : UserDetails {

    val credentials: Credentials
        get() = _credentials.withoutPassword()

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return _credentials.accountRoles.map { role -> SimpleGrantedAuthority("ROLE_" + role.role) }
                .toMutableList()
    }

    override fun isEnabled(): Boolean = true

    override fun getUsername(): String = _credentials.username

    override fun isCredentialsNonExpired(): Boolean = true

    override fun getPassword(): String = _credentials.password

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

}