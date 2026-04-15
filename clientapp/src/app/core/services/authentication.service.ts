import { Injectable, NgZone } from '@angular/core';
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

  constructor(private http: HttpService, private router: Router, private ngZone: NgZone) {
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<LoginResponse | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();

    // Proactively check for token expiration every 10 seconds
    setInterval(() => {
      this.ngZone.run(() => {
        if (this.currentUserValue && !this.isAuthenticated()) {
          console.log('Token expired, logging out...');
          this.logout();
        }
      });
    }, 10000);
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

  public updateToken(newToken: string): void {
    const user = this.currentUserValue;
    if (user) {
      user.token = newToken;
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next({ ...user });
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    if (!user || !user.token) {
      return false;
    }

    const profile = this.userProfile;
    if (!profile || !profile.exp) {
      return false;
    }

    const expirationDate = new Date(profile.exp * 1000);
    return expirationDate > new Date();
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
