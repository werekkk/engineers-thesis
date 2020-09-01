import { ShiftDto } from "./ShiftDto";

export class ShiftsDto {

    constructor(
        public shifts: ShiftDto[]
    ) {}

    addTimezoneToDates(): ShiftsDto {
        return new ShiftsDto(this.shifts.map(s => s.addTimeZoneToDates()))
    }

}