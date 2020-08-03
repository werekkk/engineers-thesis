import { AccountType } from "../AccountType";

export class AccountDto {
    constructor(
        public username: string,
        public email: string,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public accountType: AccountType
    ) {}
}