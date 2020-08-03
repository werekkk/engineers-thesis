export class PeriodBlock {

    constructor(
        public x1: number,
        public x2: number,
        public y1: number,
        public y2: number,
        public state: BlockState = BlockState.DEFAULT
    ) {}

}

export enum BlockState {
    DEFAULT = 1,
    HIGHLIGHTED = 2,
    CREATED = 3
}