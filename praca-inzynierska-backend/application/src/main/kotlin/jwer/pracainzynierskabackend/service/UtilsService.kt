package jwer.pracainzynierskabackend.service

import org.springframework.stereotype.Service
import kotlin.random.Random

@Service
class UtilsService {

    companion object {
        private val CHARS = ('a'..'z') + ('A'..'Z') + ('0'..'9')
    }

    fun generateRandomString(length: Int): String {
        val sb = StringBuilder()
        repeat(length) {
            sb.append(CHARS[Random.nextInt(0, CHARS.size)])
        }
        return sb.toString()
    }

}