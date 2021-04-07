package jwer.backend.utils

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

fun <T> T?.createResponse(): ResponseEntity<T> {
    return when (this) {
        null -> ResponseEntity(HttpStatus.BAD_REQUEST)
        else -> ResponseEntity.ok(this)
    }
}

class ControllerUtils {

    companion object {

        fun <T> createResponse(value: T?): ResponseEntity<T> {
            value?.let {
                return ResponseEntity.ok(it)
            }
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }

    }

}

