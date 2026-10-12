import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { ColorInfo } from '../services/color.service';

@Component({
  selector: 'app-color-swatch',
  standalone: true,
  template: `
    <div
      class="color-swatch rounded-xl overflow-hidden shadow-sm cursor-pointer group"
      [style.background-color]="color.hex"
      (click)="copyToClipboard()"
    >
      <div class="h-20 sm:h-24 relative">
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
          @if (isCopied()) {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          }
        </div>
      </div>
      <div class="p-3 bg-white dark:bg-gray-800">
        <p class="font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold">{{ color.hex }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ color.hsl.h }}°, {{ color.hsl.s }}%, {{ color.hsl.l }}%</p>
      </div>
    </div>
  `
})
export class ColorSwatchComponent {
  @Input({ required: true }) color!: ColorInfo;
  @Output() copy = new EventEmitter<string>();

  readonly isCopied = signal(false);

  copyToClipboard(): void {
    this.copy.emit(this.color.hex);
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), 1500);
  }
}