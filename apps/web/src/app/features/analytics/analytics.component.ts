import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
@Component({
  standalone: true,
  template: `<h1 class="font-display text-4xl">Waste analytics</h1>
    <div class="mt-8 grid gap-3 md:grid-cols-2">
      @for (row of categories(); track row.category) {
        <div class="card flex items-center justify-between p-4"><span>{{ row.category }}</span><span class="font-display text-2xl">{{ row.count }}</span></div>
      }
    </div>
    @if (!categories().length) { <p class="mt-6 text-sm text-ink/50">No analytics yet — add inventory after the API is running against Neon.</p> }`
})
export class AnalyticsComponent implements OnInit {
  private readonly api = inject(ApiService);
  categories = signal<{ category: string; count: number }[]>([]);
  ngOnInit() {
    this.api.overview().subscribe({ next: (d) => this.categories.set(d.byCategory ?? []), error: () => this.categories.set([]) });
  }
}
