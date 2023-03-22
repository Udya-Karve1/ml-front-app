import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentInterService {

  private componentInterSubject = new Subject<string>();

  constructor() { 
    this.componentInterSubject = new Subject<string>();
  }

  triggerEvent(message: string) {
    this.componentInterSubject.next(message);
  }

  onMessage(): Observable<string> {
    return this.componentInterSubject;
  }
}
