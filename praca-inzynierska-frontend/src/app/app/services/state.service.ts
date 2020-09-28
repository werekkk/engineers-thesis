import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  startingDate: Date = new Date()

  constructor() { }
}
