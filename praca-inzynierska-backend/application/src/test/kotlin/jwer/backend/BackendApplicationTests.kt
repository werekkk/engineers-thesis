package jwer.backend

import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import javax.sql.DataSource

@SpringBootTest
class BackendApplicationTests @Autowired constructor(
	private val dataSource: DataSource
) {

	@Test
	fun contextLoads() {
	}

	@Test
	fun checkDatabaseDriver() {
		assert(dataSource.connection.metaData.driverName == "H2 JDBC Driver")
	}

}
