import { ShiftDto } from './ShiftDto'

export class SavedShiftResponseDto {
    constructor(
        public savedShift: ShiftDto,
        public deletedShiftsIds: number[]
    ) {}

}