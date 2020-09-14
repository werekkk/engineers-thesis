export class ChangeAccountDetailsDto {

    constructor(
        public newEmail: string,
        public newFirstName: string,
        public newLastName: string
    ) {}

}