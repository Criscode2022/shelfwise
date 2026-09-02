import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
@Component({
  standalone: true, imports: [FormsModule, RouterLink],
  template: `<div class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
    <a routerLink="/" class="font-display text-2xl">Shelfwise</a>
    <h1 class="mt-8 font-display text-4xl">Open a kitchen</h1>
    <form class="mt-8 space-y-4" (ngSubmit)="submit()">
      <label class="block text-sm">Name<input class="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2" [(ngModel)]="name" name="name" required /></label>
      <label class="block text-sm">Email<input class="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2" [(ngModel)]="email" name="email" type="email" required /></label>
      <label class="block text-sm">Password<input class="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2" [(ngModel)]="password" name="password" type="password" required /></label>
      @if (error()) { <p class="text-sm text-clay">{{ error() }}</p> }
      <button class="w-full rounded-full bg-ink py-3 text-white" type="submit">Create account</button>
    </form>
  </div>`
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  name = ''; email = ''; password = '';
  error = signal('');
  submit() {
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.api.me().subscribe((me) => { if (me.households[0]) this.api.setHousehold(me.households[0].id); void this.router.navigateByUrl('/app'); }),
      error: () => this.error.set('Registration failed. Email may already be in use.'),
    });
  }
}
