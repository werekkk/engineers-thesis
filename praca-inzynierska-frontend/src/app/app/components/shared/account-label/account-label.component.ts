import { Component, Input, OnInit } from '@angular/core';
import { AccountDto } from 'src/app/app/model/dto/AccountDto';

@Component({
  selector: 'account-label',
  templateUrl: './account-label.component.html',
  styleUrls: ['./account-label.component.scss']
})
export class AccountLabelComponent  {

  @Input('account')
  account: AccountDto

  constructor() { }

}
