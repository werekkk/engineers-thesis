package jwer.backend.model.entity

import javax.persistence.*

@Entity
data class PreferencesWeek(

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "preferences_week_id")
        val id: Long = 0,

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "monday_preferences_id")
        val mondayPreferences: PreferencesDay = PreferencesDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "tuesday_preferences_id")
        val tuesdayPreferences: PreferencesDay = PreferencesDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "wednesday_preferences_id")
        val wednesdayPreferences: PreferencesDay = PreferencesDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "thursday_preferences_id")
        val thursdayPreferences: PreferencesDay = PreferencesDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "friday_preferences_id")
        val fridayPreferences: PreferencesDay = PreferencesDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "saturday_preferences_id")
        val saturdayPreferences: PreferencesDay = PreferencesDay(),

        @OneToOne(fetch = FetchType.EAGER, cascade = [CascadeType.ALL], orphanRemoval = true)
        @JoinColumn(name = "sunday_preferences_id")
        val sundayPreferences: PreferencesDay = PreferencesDay()

)