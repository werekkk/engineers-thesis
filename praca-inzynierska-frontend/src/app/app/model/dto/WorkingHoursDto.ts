import { TimePeriodDto } from './TimePeriodDto'
import { WorkingHoursBackendDto } from './WorkingHoursBackendDto'

export class WorkingHoursDto {
    
    monday: TimePeriodDto
    tuesday: TimePeriodDto
    wednesday: TimePeriodDto
    thursday: TimePeriodDto
    friday: TimePeriodDto
    saturday: TimePeriodDto
    sunday: TimePeriodDto

    constructor(backendDto: WorkingHoursBackendDto) {
        this.monday = backendDto.monday ? TimePeriodDto.of(backendDto.monday) : null
        this.tuesday = backendDto.tuesday ? TimePeriodDto.of(backendDto.tuesday) : null
        this.wednesday = backendDto.wednesday ? TimePeriodDto.of(backendDto.wednesday) : null
        this.thursday = backendDto.thursday ? TimePeriodDto.of(backendDto.thursday) : null
        this.friday = backendDto.friday ? TimePeriodDto.of(backendDto.friday) : null
        this.saturday = backendDto.saturday ? TimePeriodDto.of(backendDto.saturday) : null
        this.sunday = backendDto.sunday ? TimePeriodDto.of(backendDto.sunday) : null
    }
}