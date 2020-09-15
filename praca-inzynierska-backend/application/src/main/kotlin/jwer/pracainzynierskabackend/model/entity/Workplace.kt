package jwer.pracainzynierskabackend.model.entity

import javax.persistence.*

@Entity
data class Workplace (
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "workplace_id")
        val id: Long,

        @Column(name = "name")
        val name: String,

        @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        @JoinColumn(name = "employer_id", nullable = false)
        var employer: Employer?,

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "workplace", cascade = [CascadeType.ALL], orphanRemoval = true)
        val employees: List<Employee>,

        @OneToMany(fetch = FetchType.LAZY, mappedBy = "workplace", cascade = [CascadeType.ALL], orphanRemoval = true)
        val positions: List<Position>,

) {
        override fun toString(): String {
                return "<Workplace>{id: ${id}; name: ${name}; ...}"
        }
}