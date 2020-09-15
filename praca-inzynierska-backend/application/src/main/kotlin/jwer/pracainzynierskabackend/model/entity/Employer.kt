package jwer.pracainzynierskabackend.model.entity

import jwer.pracainzynierskabackend.model.auth.Account
import jwer.pracainzynierskabackend.model.auth.Credentials
import jwer.pracainzynierskabackend.model.dto.RegisterEmployeeDetailsDto
import jwer.pracainzynierskabackend.model.dto.RegisterWorkplaceDetailsDto
import javax.persistence.*

@Entity
data class Employer(
        @Id
        @Column(name = "account_id")
        val id: Long,

        @MapsId("account_id")
        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "account_id")
        val account: Account,

        @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "workplace_id")
        val workplace: Workplace
) {
        override fun toString(): String {
                return "<Employer>{id: ${id}; account:${account}; workplace: {id: ${workplace.id}; name: ${workplace.name}; ...}}"
        }
}