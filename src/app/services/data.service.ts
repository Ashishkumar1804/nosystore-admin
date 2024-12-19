import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public headerData = new BehaviorSubject<{ isHandset: boolean, headerText: string }>({ isHandset: false, headerText: '' });
  constructor() { }
}
