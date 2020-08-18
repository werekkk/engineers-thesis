package jwer.pracainzynierskabackend

import jwer.pracainzynierskabackend.model.entity.PreferencesWeek
import jwer.pracainzynierskabackend.repository.EmployeeRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class DatabaseUpdate @Autowired constructor(
        private val employeeRepository: EmployeeRepository
){

    fun updateDatabase() {
        println("Updating database started...")
        addPreferencesWeekWhereNull()
        println("Updating database finished.")
    }

    private fun addPreferencesWeekWhereNull() {
        val employees = employeeRepository.findAll()
        employees.forEach {
            @Suppress("SENSELESS_COMPARISON")
            if (it.preferencesWeek == null) {
                employeeRepository.save(it.copy(preferencesWeek = PreferencesWeek()))
            }
        }
    }

}