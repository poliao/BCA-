import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from '../http/http.service';
import { LoginRequest, LoginResponse } from '../model/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<LoginResponse | null>;
  public currentUser: Observable<LoginResponse | null>;

  constructor(private http: HttpService, private router: Router) {
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('v1/auth/login', credentials).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }

  public get userProfile(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
}
