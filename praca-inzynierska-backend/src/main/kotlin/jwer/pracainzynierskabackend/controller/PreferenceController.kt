package jwer.pracainzynierskabackend.controller

import jwer.pracainzynierskabackend.model.dto.PreferencesWeekDto
import jwer.pracainzynierskabackend.service.PreferenceService
import jwer.pracainzynierskabackend.utils.ControllerUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/preference")
class PreferenceController @Autowired constructor(
        private val preferenceService: PreferenceService
) {

    @GetMapping("/week")
    fun getPreferencesWeekByPrincipal(principal: Principal): ResponseEntity<PreferencesWeekDto> {
        return ControllerUtils.createResponse(preferenceService.getPreferencesByEmployeePrincipal(principal))
    }

    @PostMapping("/week")
    fun savePreferencesWeekByPrincipal(principal: Principal, @RequestBody newPreferencesWeek: PreferencesWeekDto): ResponseEntity<PreferencesWeekDto> {
        return ControllerUtils.createResponse(preferenceService.savePreferencesByEmployeePrincipal(principal, newPreferencesWeek))
    }

}