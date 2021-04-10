package jwer.backend.utils

import java.security.Principal

class TestUser(private val username: String): Principal {
    override fun getName(): String = username
}