// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userEmail = new BehaviorSubject<string>('');

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get currentUserEmail() {
    return this.userEmail.asObservable();
  }

  login(email: string) {
    this.loggedIn.next(true);
    this.userEmail.next(email);
  }

  logout() {
    this.loggedIn.next(false);
    this.userEmail.next('');
  }
}
