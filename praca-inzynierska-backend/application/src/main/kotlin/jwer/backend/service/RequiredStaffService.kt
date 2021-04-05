package jwer.backend.service

import jwer.backend.model.auth.AccountType
import jwer.backend.model.dto.AccountDto
import jwer.backend.model.dto.RequiredStaffDto
import jwer.backend.model.entity.RequiredStaff
import jwer.backend.repository.PositionRepository
import jwer.backend.repository.RequiredStaffRepository
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
        val account = userService.getAccount(principal)
        return getRequiredStaffByEmployerAccountAndPositionId(account, positionId)
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

    fun getRequiredStaffByEmployerAccountAndPositionId(account: AccountDto, positionId: Long): RequiredStaffDto? {
        if (account.accountType == AccountType.EMPLOYER) {
            requiredStaffRepository.findByPositionIdAndEmployerUsername(positionId, account.username!!)?.let {
                return RequiredStaffDto(it)
            }
        }
        return null
    }

}