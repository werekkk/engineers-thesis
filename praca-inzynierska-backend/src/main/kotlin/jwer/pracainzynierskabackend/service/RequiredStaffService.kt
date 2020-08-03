package jwer.pracainzynierskabackend.service

import jwer.pracainzynierskabackend.model.auth.AccountType
import jwer.pracainzynierskabackend.model.dto.RequiredStaffDto
import jwer.pracainzynierskabackend.model.entity.Position
import jwer.pracainzynierskabackend.model.entity.RequiredStaff
import jwer.pracainzynierskabackend.repository.PositionRepository
import jwer.pracainzynierskabackend.repository.RequiredStaffRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.security.Principal

@Service
class RequiredStaffService @Autowired constructor(
        private val userService: UserService,
        private val positionRepository: PositionRepository,
        private val requiredStaffRepository: RequiredStaffRepository
){

    fun getRequiredStaffByPrincipalAndPositionId(principal: Principal, positionId: Long): RequiredStaffDto? {
        userService.getAccount(principal).let { ac ->
            if (ac.accountType == AccountType.EMPLOYER) {
                requiredStaffRepository.findByPositionIdAndEmployerUsername(positionId, ac.username!!)?.let {
                    return RequiredStaffDto(it)
                }
            }
        }
        return null
    }

    fun saveRequiredStaffByPrincipalAndPositionId(principal: Principal, positionId: Long, newRequiredStaff: RequiredStaffDto): RequiredStaffDto? {
        userService.getAccount(principal).let { ac ->
            if (ac.accountType == AccountType.EMPLOYER) {
                positionRepository.getPositionByEmployerUsername(ac.username!!).find { p -> p.id == positionId}?.let {
                    val updatedPosition = it.copy(requiredStaff = RequiredStaff(newRequiredStaff))
                    val savedPosition = positionRepository.save(updatedPosition)
                    return RequiredStaffDto(savedPosition.requiredStaff)
                }
            }
        }
        return null
    }

}