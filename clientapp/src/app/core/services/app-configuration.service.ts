import { Inject, Injectable, signal } from "@angular/core";

export type AppConfiguration = {
  IdentityUrl: string;
  ReportUrl: string;
  languages: Array<{ value: string, text: string }>;
  ShowBanner: string;
  BannerColor: string;
  environment: string;
  ClientId: string;
  Scope: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigurationService {
  private configuration$ = signal<AppConfiguration | null>(null);

  constructor(@Inject('BASE_URL') private baseUrl: string) { }

  async loadConfigAsync(): Promise<void> {
    // Stubbed configuration for UI-only mode
    const mockConfig: AppConfiguration = {
      IdentityUrl: '',
      ReportUrl: 'http://localhost:5000',
      languages: [
        { value: 'TH', text: 'Thai' },
        { value: 'EN', text: 'English' }
      ],
      ShowBanner: 'false',
      BannerColor: '',
      environment: 'Development',
      ClientId: 'pico-web-portal',
      Scope: 'openid profile offline_access'
    };

    this.configuration$.set(mockConfig);
  }

  get config(): AppConfiguration {
    return this.configuration$();
  }
  
}
