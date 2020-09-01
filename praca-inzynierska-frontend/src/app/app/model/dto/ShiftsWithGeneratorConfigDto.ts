import { ShiftsDto } from './ShiftsDto'
import { GeneratorConfigDto } from './GeneratorConfigDto'

export class ShiftsWithGeneratorConfigDto {

    constructor(
        public shifts: ShiftsDto,
        public generatorConfig: GeneratorConfigDto
    ) {}

}