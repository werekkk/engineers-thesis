package jwer.pracainzynierskabackend.utils

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

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

