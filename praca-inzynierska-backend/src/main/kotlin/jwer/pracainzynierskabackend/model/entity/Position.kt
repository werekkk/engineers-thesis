package jwer.pracainzynierskabackend.model.entity

import jwer.pracainzynierskabackend.model.dto.PositionDto
import javax.persistence.*

@Entity
data class Position(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "position_id")
    val id: Long,

    @Column(name = "name")
    val name: String,
    @Column(name = "description")
    val description: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workplace_id")
    val workplace: Workplace,

    @ManyToMany(fetch = FetchType.LAZY)
    val employees: List<Employee>,

    @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "required_staff_id")
    val requiredStaff: RequiredStaff = RequiredStaff()

) {
    constructor(positionDto: PositionDto, workplace: Workplace) :
            this(positionDto.id ?: 0, positionDto.name, "", workplace, listOf())
}