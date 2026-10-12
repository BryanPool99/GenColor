import { Injectable, signal, effect, inject, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly STORAGE_KEY = 'theme-preference';

  readonly theme = signal<Theme>('light');
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.initializeTheme();
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  private initializeTheme(): void {
    const stored = this.document.defaultView?.localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      this.theme.set(stored);
    } else {
      const prefersDark = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }
  }

  private applyTheme(theme: Theme): void {
    const html = this.document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    this.document.defaultView?.localStorage.setItem(this.STORAGE_KEY, theme);
  }

  toggleTheme(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }
}