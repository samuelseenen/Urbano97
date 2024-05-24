import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserEmail = new BehaviorSubject<string | null>(null);
  private currentUserType = new BehaviorSubject<string | null>(null);

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUserEmail$(): Observable<string | null> {
    return this.currentUserEmail.asObservable();
  }

  get currentUserType$(): Observable<string | null> {
    return this.currentUserType.asObservable();
  }

  login(email: string, tipoUsuario: string): void {
    this.loggedIn.next(true);
    this.currentUserEmail.next(email);
    this.currentUserType.next(tipoUsuario);
  }

  logout(): void {
    this.loggedIn.next(false);
    this.currentUserEmail.next(null);
    this.currentUserType.next(null);
  }
}
