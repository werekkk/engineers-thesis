import { FormError } from '../FormError';
import { AccountDto } from './AccountDto';

export class AccountResponseDto {

    constructor(
        public error: FormError,
        public account: AccountDto
    ) {}

}