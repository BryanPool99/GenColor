import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../services/translation.service';

export interface PaletteOption {
  id: string;
  icon: string;
}

@Component({
  selector: 'app-palette-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      @for (option of paletteOptions(); track option.id) {
        <button
          type="button"
          (click)="select(option.id)"
          [class.ring-2]="selected() === option.id"
          [class.ring-blue-500]="selected() === option.id"
          [class.bg-blue-50]="selected() === option.id"
          [class.text-blue-700]="selected() === option.id"
          [class.dark:bg-blue-900/30]="selected() === option.id"
          [class.dark:text-blue-300]="selected() === option.id"
          [class.bg-gray-50]="selected() !== option.id"
          [class.text-gray-600]="selected() !== option.id"
          [class.dark:bg-slate-700/50]="selected() !== option.id"
          [class.dark:text-slate-300]="selected() !== option.id"
          [class.hover:bg-gray-100]="selected() !== option.id"
          [class.dark:hover:bg-slate-700]="selected() !== option.id"
          class="p-3 rounded-xl text-left transition-all duration-200 flex items-center gap-2 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <span class="text-xl">{{ option.icon }}</span>
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ paletteName(option.id) }}</span>
            <span class="text-xs text-gray-400 dark:text-slate-500">{{ paletteDesc(option.id) }}</span>
          </div>
        </button>
      }
    </div>
  `
})
export class PaletteSelectorComponent {
  private translationService = inject(TranslationService);

  @Input({ required: true }) selected!: string;
  @Output() selectionChange = new EventEmitter<string>();

  readonly paletteOptions = signal<PaletteOption[]>([
    { id: 'monochromatic', icon: '📊' },
    { id: 'complementary', icon: '⚖️' },
    { id: 'analogous', icon: '🌈' },
    { id: 'triadic', icon: '🔺' },
    { id: 'tetradic', icon: '🟦' },
    { id: 'square', icon: '⬜' },
    { id: 'harmony', icon: '🎵' },
    { id: 'trending', icon: '🔥' },
  ]);

  paletteName(id: string): string {
    return this.translationService.tPaletteType(id, 'name');
  }

  paletteDesc(id: string): string {
    return this.translationService.tPaletteType(id, 'desc');
  }

  select(id: string): void {
    this.selectionChange.emit(id);
  }
}