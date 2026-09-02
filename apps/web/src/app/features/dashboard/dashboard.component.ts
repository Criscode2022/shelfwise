import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
@Component({
  standalone: true,
  template: `<h1 class="font-display text-4xl">Kitchen pulse</h1>
    <p class="mt-2 text-ink/60">Expiry heat and capital sitting on the shelf.</p>
    @if (error()) { <p class="mt-4 text-clay">{{ error() }}</p> }
    <div class="mt-8 grid gap-4 sm:grid-cols-4">
      @for (k of cards(); track k.label) {
        <div class="card p-5"><p class="text-xs uppercase tracking-wide text-ink/50">{{ k.label }}</p><p class="mt-2 font-display text-3xl">{{ k.value }}</p></div>
      }
    </div>`
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  cards = signal<{ label: string; value: string }[]>([]);
  error = signal('');
  ngOnInit() {
    this.api.overview().subscribe({
      next: (d) => this.cards.set([
        { label: 'Items', value: String(d.totalItems) },
        { label: 'Expired', value: String(d.expiredCount) },
        { label: 'At risk', value: String(d.atRiskCount) },
        { label: 'Waste $', value: `$${d.estimatedWasteUsd}` },
      ]),
      error: () => this.error.set('Connect the Nest API and select a household to load live metrics.'),
    });
  }
}
