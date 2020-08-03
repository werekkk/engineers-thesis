import { TimeDto } from 'src/app/app/model/dto/TimeDto'

export enum TimeStep {
    ONE_HOUR = 60,
    THIRTY_MINUTES = 30,
    FIFTEEN_MINUTES = 15,
    TEN_MINUTES = 10,
    FIVE_MINUTES = 5
}

export namespace TimeStep {

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

}