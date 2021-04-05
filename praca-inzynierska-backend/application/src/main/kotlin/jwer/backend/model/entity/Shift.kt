package jwer.backend.model.entity

import jwer.backend.model.embeddable.DateTimePeriod
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class Shift(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "shift_id")
        val id: Long = 0,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "employee_id")
        val employee: Employee,

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "position_id")
        val position: Position,

        @Column(name = "creation_date")
        val creationDate: LocalDateTime,

        @Embedded
        @Column(name = "shift_period")
        val period: DateTimePeriod,

        @Column(name = "shift_type")
        val shiftType: ShiftType
)