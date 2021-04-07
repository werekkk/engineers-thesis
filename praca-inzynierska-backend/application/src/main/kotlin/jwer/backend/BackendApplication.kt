package jwer.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.runApplication
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer

@SpringBootApplication
class BackendApplication : SpringBootServletInitializer() {

	override fun configure(builder: SpringApplicationBuilder?): SpringApplicationBuilder {
		return builder!!.sources(BackendApplication::class.java)
	}

}

fun main(args: Array<String>) {
	runApplication<BackendApplication>(*args)
}
