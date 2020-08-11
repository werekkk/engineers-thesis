package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.dto.PreferencesWeekDto
import jwer.pracainzynierskabackend.model.entity.PreferencesWeek
import jwer.pracainzynierskabackend.repository.EmployeeRepository
import jwer.pracainzynierskabackend.repository.PreferencesWeekRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.security.Principal

@Service
class PreferenceService @Autowired constructor(
        private val employeeService: EmployeeService,
        private val preferencesWeekRepository: PreferencesWeekRepository
){

    fun getPreferencesByEmployeePrincipal(employeePrincipal: Principal): PreferencesWeekDto? {
        employeeService.getByEmployeePrincipal(employeePrincipal)?.let { e ->
            getPreferencesByEmployeeId(e.id)?.let {
                return PreferencesWeekDto(it)
            }
        }
        return null
    }

    fun savePreferencesByEmployeePrincipal(employeePrincipal: Principal, preferences: PreferencesWeekDto): PreferencesWeekDto? {
        employeeService.getByEmployeePrincipal(employeePrincipal)?.let { e ->
            getPreferencesByEmployeeId(e.id)?.let {
                val updatedPreferences = it.copy(
                        mondayPreferences = it.mondayPreferences.update(preferences.mondayPreferences),
                        tuesdayPreferences = it.tuesdayPreferences.update(preferences.tuesdayPreferences),
                        wednesdayPreferences = it.wednesdayPreferences.update(preferences.wednesdayPreferences),
                        thursdayPreferences = it.thursdayPreferences.update(preferences.thursdayPreferences),
                        fridayPreferences = it.fridayPreferences.update(preferences.fridayPreferences),
                        saturdayPreferences = it.saturdayPreferences.update(preferences.saturdayPreferences),
                        sundayPreferences = it.sundayPreferences.update(preferences.sundayPreferences)
                )
                return PreferencesWeekDto(preferencesWeekRepository.save(updatedPreferences))
            }
        }
        return null
    }

    private fun getPreferencesByEmployeeId(employeeId: Long): PreferencesWeek? {
        return preferencesWeekRepository.findByEmployeeId(employeeId)
    }

}