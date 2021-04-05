package jwer.backend.model.entity

import jwer.backend.model.dto.PreferencesDayDto
import javax.persistence.*

@Entity
data class PreferencesDay(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "preferences_day_id")
        val id: Long = 0,

        @OneToMany(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], mappedBy = "day", orphanRemoval = true)
        val hourPreferences: List<HourPreference> = listOf()
) {
        fun update(pdDto: PreferencesDayDto): PreferencesDay {
                return this.copy(
                        hourPreferences = pdDto.preferences.map { hp -> HourPreference(hp, this) }
                )
        }
}