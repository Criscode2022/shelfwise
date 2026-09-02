import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  standalone: true, imports: [RouterLink],
  template: `<div class="min-h-screen">
    <header class="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <p class="font-display text-2xl">Shelfwise</p>
      <nav class="flex gap-4 text-sm font-semibold">
        <a routerLink="/login" class="rounded-full px-4 py-2 hover:bg-white">Log in</a>
        <a routerLink="/register" class="rounded-full bg-leaf-700 px-4 py-2 text-white">Start kitchen</a>
      </nav>
    </header>
    <main class="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-clay">Food waste OS</p>
        <h1 class="mt-4 font-display text-5xl leading-tight md:text-6xl">Know what expires before it becomes compost.</h1>
        <p class="mt-6 max-w-xl text-lg text-ink/70">Inventory, shopping lists, and cost-of-waste analytics for households and small kitchens — wired to Neon Postgres.</p>
        <div class="mt-8 flex gap-3">
          <a routerLink="/register" class="rounded-full bg-ink px-6 py-3 text-white">Create household</a>
          <a routerLink="/login" class="rounded-full border border-ink/20 px-6 py-3">Demo login</a>
        </div>
      </div>
      <div class="card p-6">
        <p class="text-sm font-semibold text-leaf-700">This week at Harbor Kitchen</p>
        <div class="mt-4 grid grid-cols-3 gap-3 text-center">
          <div class="rounded-xl bg-cream p-4"><p class="text-3xl font-display">3</p><p class="text-xs">at risk</p></div>
          <div class="rounded-xl bg-cream p-4"><p class="text-3xl font-display">$8</p><p class="text-xs">waste risk</p></div>
          <div class="rounded-xl bg-cream p-4"><p class="text-3xl font-display">18</p><p class="text-xs">on shelves</p></div>
        </div>
      </div>
    </main>
  </div>`
})
export class LandingComponent {}
