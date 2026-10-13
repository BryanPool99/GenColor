import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Locale } from '../services/translation.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="toggleLanguage()"
      [attr.aria-label]="t('aria.toggleLanguage')"
      class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
    >
      <ng-container *ngIf="currentLocale() === 'es'; else enBtn">
        <span class="text-sm font-medium px-2 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">ES</span>
      </ng-container>
      <ng-template #enBtn>
        <span class="text-sm font-medium px-2 py-1 rounded-lg bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300">ES</span>
      </ng-template>

      <ng-container *ngIf="currentLocale() === 'en'; else esBtn">
        <span class="text-sm font-medium px-2 py-1 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">EN</span>
      </ng-container>
      <ng-template #esBtn>
        <span class="text-sm font-medium px-2 py-1 rounded-lg bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300">EN</span>
      </ng-template>
    </button>
  `
})
export class LanguageToggleComponent {
  private translationService = inject(TranslationService);

  readonly currentLocale = this.translationService.locale;

  t(key: string): string {
    return this.translationService.t(key);
  }

  toggleLanguage(): void {
    const next: Locale = this.currentLocale() === 'es' ? 'en' : 'es';
    this.translationService.setLocale(next);
  }
}