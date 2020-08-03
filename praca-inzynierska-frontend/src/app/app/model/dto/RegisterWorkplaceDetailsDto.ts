export class RegisterWorkplaceDetailsDto {
    constructor(
        public employer: RegisterWorkplaceDetailsDto,
        public workplaceName: string
    ) {}
}