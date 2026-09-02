import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
@Component({
  standalone: true, imports: [FormsModule],
  template: `<div class="flex flex-wrap items-end justify-between gap-3">
      <h1 class="font-display text-4xl">Shopping lists</h1>
      <button class="rounded-full bg-clay px-4 py-2 text-sm text-white" (click)="rescue()">Build from expiring</button>
    </div>
    <form class="mt-6 flex gap-2" (ngSubmit)="create()">
      <input class="flex-1 rounded-xl border border-ink/15 px-3 py-2" placeholder="List title" [(ngModel)]="title" name="title" />
      <button class="rounded-xl bg-leaf-700 px-4 text-white">Create</button>
    </form>
    <div class="mt-8 grid gap-4 md:grid-cols-2">
      @for (list of lists(); track list.id) {
        <article class="card p-5">
          <h2 class="font-semibold">{{ list.title }}</h2>
          <ul class="mt-3 space-y-2 text-sm">
            @for (line of list.lines; track line.id) {
              <li class="flex items-center gap-2">
                <input type="checkbox" [checked]="line.checked" (change)="toggle(line.id)" />
                <span [class.line-through]="line.checked">{{ line.name }}</span>
              </li>
            }
          </ul>
        </article>
      }
    </div>`
})
export class ListsComponent implements OnInit {
  private readonly api = inject(ApiService);
  lists = signal<any[]>([]);
  title = 'Market run';
  ngOnInit() { this.refresh(); }
  refresh() { this.api.lists().subscribe({ next: (rows) => this.lists.set(rows), error: () => this.lists.set([]) }); }
  create() { this.api.createList(this.title, [{ name: 'Staples' }]).subscribe(() => this.refresh()); }
  rescue() { this.api.rescueList().subscribe(() => this.refresh()); }
  toggle(id: string) { this.api.toggleLine(id).subscribe(() => this.refresh()); }
}
