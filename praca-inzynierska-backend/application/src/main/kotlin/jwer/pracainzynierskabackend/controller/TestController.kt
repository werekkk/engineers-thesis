package jwer.pracainzynierskabackend.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController()
@RequestMapping("/test")
class TestController {

    companion object {

        class TestDto(val message: String)

    }

    @GetMapping
    fun test(): ResponseEntity<TestDto> {
        return ResponseEntity.ok(TestDto("Test message."))
    }

}
