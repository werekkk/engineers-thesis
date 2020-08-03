export class RegisterEmployeeDetailsDto {
    constructor(
        public username: String,
        public password: String,
        public email: String,
        public invitationToken: String
    ) {}
}