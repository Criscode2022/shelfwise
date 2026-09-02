import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
export type SessionUser = { id: string; email: string; name: string };
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'shelfwise.token';
  readonly user = signal<SessionUser | null>(null);
  readonly loggedIn = computed(() => !!this.token());
  constructor(private readonly http: HttpClient, private readonly router: Router) {
    const raw = localStorage.getItem('shelfwise.user');
    if (raw) this.user.set(JSON.parse(raw));
  }
  token() { return localStorage.getItem(this.tokenKey); }
  login(email: string, password: string) {
    return this.http.post<{ accessToken: string; user: SessionUser }>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(tap((res) => this.persist(res)));
  }
  register(name: string, email: string, password: string) {
    return this.http.post<{ accessToken: string; user: SessionUser }>(`${environment.apiUrl}/auth/register`, { name, email, password }).pipe(tap((res) => this.persist(res)));
  }
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('shelfwise.user');
    this.user.set(null);
    void this.router.navigateByUrl('/');
  }
  private persist(res: { accessToken: string; user: SessionUser }) {
    localStorage.setItem(this.tokenKey, res.accessToken);
    localStorage.setItem('shelfwise.user', JSON.stringify(res.user));
    this.user.set(res.user);
  }
}
