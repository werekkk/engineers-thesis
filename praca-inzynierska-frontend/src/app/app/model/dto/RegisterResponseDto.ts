import { RegisterError } from '../RegisterError';
import { AccountDto } from './AccountDto';

export class RegisterResponseDto {

    constructor(
        public error: RegisterError,
        public account: AccountDto
    ) {}

}