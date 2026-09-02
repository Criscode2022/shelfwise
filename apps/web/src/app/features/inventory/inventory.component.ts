import { SlicePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
@Component({
  standalone: true, imports: [FormsModule, SlicePipe],
  template: `<h1 class="font-display text-4xl">Inventory</h1>
    <form class="card mt-6 grid gap-3 p-4 md:grid-cols-6" (ngSubmit)="add()">
      <input class="rounded-lg border border-ink/15 px-3 py-2 md:col-span-2" placeholder="Name" [(ngModel)]="name" name="name" required />
      <input class="rounded-lg border border-ink/15 px-3 py-2" placeholder="Category" [(ngModel)]="category" name="category" required />
      <input class="rounded-lg border border-ink/15 px-3 py-2" type="number" placeholder="Qty" [(ngModel)]="quantity" name="quantity" required />
      <input class="rounded-lg border border-ink/15 px-3 py-2" type="date" [(ngModel)]="expiresOn" name="expiresOn" />
      <button class="rounded-lg bg-leaf-700 text-white">Add</button>
    </form>
    <table class="mt-6 w-full text-left text-sm">
      <tbody>
        @for (item of items(); track item.id) {
          <tr class="border-t border-ink/5">
            <td class="p-3 font-semibold">{{ item.name }}</td>
            <td>{{ item.quantity }} {{ item.unit }}</td>
            <td>{{ item.expiresOn ? (item.expiresOn | slice:0:10) : '—' }}</td>
            <td><button class="text-clay" (click)="remove(item.id)">Remove</button></td>
          </tr>
        }
      </tbody>
    </table>`
})
export class InventoryComponent implements OnInit {
  private readonly api = inject(ApiService);
  items = signal<any[]>([]);
  name = ''; category = 'Produce'; quantity = 1; expiresOn = '';
  ngOnInit() { this.refresh(); }
  refresh() { this.api.items().subscribe({ next: (rows) => this.items.set(rows), error: () => this.items.set([]) }); }
  add() { this.api.createItem({ name: this.name, category: this.category, quantity: this.quantity, unit: 'pcs', expiresOn: this.expiresOn || undefined }).subscribe(() => { this.name = ''; this.refresh(); }); }
  remove(id: string) { this.api.deleteItem(id).subscribe(() => this.refresh()); }
}
