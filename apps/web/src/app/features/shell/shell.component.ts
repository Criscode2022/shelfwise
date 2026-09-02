import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
@Component({
  standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<div class="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
    <aside class="border-b border-ink/10 bg-white px-5 py-6 lg:border-b-0 lg:border-r">
      <p class="font-display text-2xl">Shelfwise</p>
      <p class="mt-1 text-sm text-ink/60">{{ auth.user()?.name }}</p>
      <nav class="mt-8 flex flex-wrap gap-2 lg:flex-col">
        @for (link of links; track link.to) {
          <a [routerLink]="link.to" routerLinkActive="bg-leaf-50 text-leaf-700" class="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-cream">{{ link.label }}</a>
        }
      </nav>
      <button class="mt-8 text-sm text-ink/50" (click)="auth.logout()">Sign out</button>
    </aside>
    <main class="px-4 py-6 lg:px-10"><router-outlet /></main>
  </div>`
})
export class ShellComponent {
  readonly auth = inject(AuthService);
  readonly links = [
    { to: '/app/dashboard', label: 'Dashboard' },
    { to: '/app/inventory', label: 'Inventory' },
    { to: '/app/lists', label: 'Lists' },
    { to: '/app/analytics', label: 'Analytics' },
  ];
}
