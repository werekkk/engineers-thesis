import { Pipe, PipeTransform } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { EmployeeDto } from '../model/dto/EmployeeDto';

@Pipe({
  name: 'invitationLink'
})
export class InvitationLinkPipe implements PipeTransform {

  transform(e: EmployeeDto, ...args: unknown[]): unknown {
    return EmployeeService.generateInvitationLink(e.invitationToken);
  }

}
