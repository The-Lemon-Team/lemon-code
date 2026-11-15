import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { ProfileService } from './core/services/profile.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, LanguageSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-surface text-on-surface flex flex-col">
      <header
        class="sticky top-0 z-30 border-b border-outline-variant/25 bg-surface-container-lowest/90 backdrop-blur-md"
      >
        <div
          class="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs"
            >
              <span class="material-symbols-rounded text-lg" style="font-variation-settings: 'FILL' 1">
                terminal
              </span>
            </div>
            <span class="font-headline-sm text-base font-bold tracking-tight">Lemon Code</span>
            @if (profileService.activeProfile$ | async; as active) {
              <span
                class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-code-sm text-[11px]"
              >
                &#64;{{ active.handle }}
              </span>
            }
          </div>

          <div class="flex items-center gap-2">
            <app-language-switcher />
            <button
              type="button"
              (click)="themeService.toggle()"
              class="w-9 h-9 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center transition-colors"
              [attr.aria-label]="
                (themeService.theme$ | async) === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
              "
            >
              <span class="material-symbols-rounded text-lg">
                {{ (themeService.theme$ | async) === 'dark' ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
  readonly profileService = inject(ProfileService);
}
