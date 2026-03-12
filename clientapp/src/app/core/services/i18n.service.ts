import { EventEmitter, Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { AppConfigurationService } from './app-configuration.service';

const languageKey: string = 'language';

export enum SupportedLanguages {
  Eng = 'EN',
  Thai = 'TH',
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  defaultLanguage: string = SupportedLanguages.Thai;

  private langChangeSubscription!: Subscription;
  onLangChanged: EventEmitter<LangChangeEvent> = this.translateService.onLangChange;

  constructor(private translateService: TranslateService, private config: AppConfigurationService) { }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param defaultLanguage The default language to use.
   * @param supportedLanguages The list of supported languages.
   */
  init(defaultLanguage?: string): void {
    // Warning: this subscription will always be alive for the app's lifetime
    this.langChangeSubscription = this.translateService.onLangChange
      .subscribe((event: LangChangeEvent) => localStorage.setItem(languageKey, event.lang));
    this.language = defaultLanguage || localStorage.getItem(languageKey) || this.defaultLanguage;
  }

  /**
   * Cleans up language change subscription.
   */
  destroy(): void {
    if (this.langChangeSubscription)
      this.langChangeSubscription.unsubscribe();
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param language The IETF language code to set.
   */
  set language(language: string) {
    language = language ?? localStorage.getItem(languageKey) ?? this.translateService.getBrowserCultureLang();
    let isSupportedLanguage = this.config.config.languages.map(l => l.value).includes(language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.config.config.languages.map(l => l.value).find(supportedLanguage => supportedLanguage.startsWith(language)) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) language = this.defaultLanguage;
    this.translateService.use(language);
  }

  /**
   * Gets the current language.
   * @return The current language code.
   */
  get language(): string {
    return this.translateService.currentLang;
  }
}