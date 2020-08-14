import { TimeDto } from 'src/app/app/model/dto/TimeDto'
import * as moment from 'moment'

export enum TimeStep {
    ONE_HOUR = 60,
    THIRTY_MINUTES = 30,
    FIFTEEN_MINUTES = 15,
    TEN_MINUTES = 10,
    FIVE_MINUTES = 5
}

export namespace TimeStep {

    export const DEFAULT: TimeStep = TimeStep.FIFTEEN_MINUTES

    export function transformTimeDtoToTimeStep(time: TimeDto, step: TimeStep) {
        let newTime = TimeStep.toTimeDto(step, this.toDayPercentage())
        time.hour = newTime.hour
        time.minute = newTime.minute
        time.second = newTime.second
    }

    export function toTimeDto(step: TimeStep, percentage: number): TimeDto {
        let stepCount = Math.round(percentage / (1 / timeStepsPerDay(step)))
        return toTimeDtoFromStepCount(step, stepCount)
    }

    function toTimeDtoFromStepCount(step: TimeStep, stepCount: number): TimeDto {
        let hours = Math.floor((step * stepCount) / 60)
        let minutes = (step * stepCount) % 60
        return new TimeDto(hours, minutes, 0)
    }

    function timeStepsPerDay(step: TimeStep): number {
        return (24*60) / step
    }

    export function getAllHoursByStep(timeStep: TimeStep) {
        switch (timeStep) {
            case TimeStep.ONE_HOUR:
                return oneHourHours
            case TimeStep.THIRTY_MINUTES:
                return thirtyMinutesHours
            case TimeStep.FIFTEEN_MINUTES:
                return fifteenMinutesHours
            case TimeStep.TEN_MINUTES:
                return tenMinutesHours
            case TimeStep.FIVE_MINUTES:
                return fiveMinutesHours
            default:
                return []
        }
    }

    export function getAllTimeDtosByStep(timeStep: TimeStep) {
        switch (timeStep) {
            case TimeStep.ONE_HOUR:
                return oneHourTimeDtos
            case TimeStep.THIRTY_MINUTES:
                return thirtyMinutesTimeDtos
            case TimeStep.FIFTEEN_MINUTES:
                return fifteenMinutesTimeDtos
            case TimeStep.TEN_MINUTES:
                return tenMinutesTimeDtos
            case TimeStep.FIVE_MINUTES:
                return fiveMinutesTimeDtos
            default:
                return []
        }
    }

    const oneHourHours: string[] = _getAllHoursByStep(TimeStep.ONE_HOUR)
    const thirtyMinutesHours: string[] = _getAllHoursByStep(TimeStep.THIRTY_MINUTES)
    const fifteenMinutesHours: string[] = _getAllHoursByStep(TimeStep.FIFTEEN_MINUTES)
    const tenMinutesHours: string[] = _getAllHoursByStep(TimeStep.TEN_MINUTES)
    const fiveMinutesHours: string[] = _getAllHoursByStep(TimeStep.FIVE_MINUTES)

    const oneHourTimeDtos: TimeDto[] = _getAllTimeDtosByStep(TimeStep.ONE_HOUR)
    const thirtyMinutesTimeDtos: TimeDto[] = _getAllTimeDtosByStep(TimeStep.THIRTY_MINUTES)
    const fifteenMinutesTimeDtos: TimeDto[] = _getAllTimeDtosByStep(TimeStep.FIFTEEN_MINUTES)
    const tenMinutesTimeDtos: TimeDto[] = _getAllTimeDtosByStep(TimeStep.TEN_MINUTES)
    const fiveMinutesTimeDtos: TimeDto[] = _getAllTimeDtosByStep(TimeStep.FIVE_MINUTES)

    function _getAllHoursByStep(step: TimeStep): string[] {
        let m = moment('00:00', 'HH:mm')
        let iterations = (24 * 60) / step
        let hours: string[] = []
        for (let index = 0; index < iterations; index++) {
            hours.push(m.format('HH:mm'))
            m = m.add(step, 'minutes')            
        }
        hours.push('24:00')
        return hours
    }

    function _getAllTimeDtosByStep(step: TimeStep): TimeDto[] {
        let m = moment('00:00', 'HH:mm')
        let iterations = (24 * 60) / step
        let hours: TimeDto[] = []
        for (let index = 0; index < iterations; index++) {
            hours.push(new TimeDto(m.hours(), m.minutes(), 0))
            m = m.add(step, 'minutes')            
        }
        hours.push(new TimeDto(24, 0, 0))
        return hours
    }

}