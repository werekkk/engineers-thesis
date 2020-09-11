export class PositionDto {
    constructor(
        public id: number,
        public name: string
    ) {}

    static compare = (a: PositionDto, b: PositionDto) => {
        return a.name.localeCompare(b.name)
    }
}