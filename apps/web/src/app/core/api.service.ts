import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly householdId = signal<string | null>(localStorage.getItem('shelfwise.household'));
  constructor(private readonly http: HttpClient) {}
  setHousehold(id: string) { this.householdId.set(id); localStorage.setItem('shelfwise.household', id); }
  me() { return this.http.get<{ households: { id: string; name: string; role: string }[] }>(`${environment.apiUrl}/auth/me`); }
  items() { return this.http.get<any[]>(`${environment.apiUrl}/items`, { params: { householdId: this.householdId() ?? '' } }); }
  createItem(body: Record<string, unknown>) { return this.http.post(`${environment.apiUrl}/items`, { ...body, householdId: this.householdId() }); }
  deleteItem(id: string) { return this.http.delete(`${environment.apiUrl}/items/${id}`); }
  lists() { return this.http.get<any[]>(`${environment.apiUrl}/lists`, { params: { householdId: this.householdId() ?? '' } }); }
  createList(title: string, lines: { name: string }[]) { return this.http.post(`${environment.apiUrl}/lists`, { householdId: this.householdId(), title, lines }); }
  rescueList() { return this.http.post(`${environment.apiUrl}/lists/from-expiring`, { householdId: this.householdId() }); }
  toggleLine(id: string) { return this.http.patch(`${environment.apiUrl}/lists/lines/${id}`, {}); }
  overview() { return this.http.get<any>(`${environment.apiUrl}/analytics/overview`, { params: { householdId: this.householdId() ?? '' } }); }
}
