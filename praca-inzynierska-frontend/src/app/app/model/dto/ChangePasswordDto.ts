export class ChangePasswordDto {

    constructor(
        public oldPassword: string,
        public newPassword: string
    ) {}

}