import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClickService {

  appClick: Subject<any> = new Subject()

  constructor() { }

}
