import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletSidenavService {
  private opened: boolean = false;
  subject = new Subject<any>();
  constructor() {}

  public toggleNav() {
    this.opened = !this.opened;
    this.subject.next(this.opened);
  }

  public close() {
    this.opened = false;
    this.subject.next(this.opened);
  }

  public open() {
    this.opened = true;
    this.subject.next(this.opened);
  }

  public getStatus(): Observable<any> {
    return this.subject.asObservable();
  }
}
