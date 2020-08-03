export class SetPositionsDto {
    constructor(
        public employeeId: number,
        public positionIds: number[]
    ) {}
}