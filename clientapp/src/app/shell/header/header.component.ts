import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigurationService } from '@app/core/services/app-configuration.service';
import { I18nService } from '@app/core/services/i18n.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  langs = [];
  
  constructor(
    private config: AppConfigurationService,
    public i18n: I18nService,
    private router: Router,
    public sidebarservice: SidebarService,
  ) {
    this.langs = this.config.config.languages;
  }

  get lang() {
    return this.langs.find(l => l.value === this.i18n.language)?.text || this.i18n.language;
  }

  private extractUrl(url: string) {
    let result = url.match(/^\/[0-9a-zA-Z]+(?:\/[0-9a-zA-Z]+)?/);
    if (result?.length) {
      return result[0];
    }
    return '/dashboard';
  }

  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  changeCompany(company: any) {
    console.log('Change company clicked', company);
  }

  changeOrganization(organization: any) {
    console.log('Change organization clicked', organization);
  }

  changeLanguage(lang: string) {
    this.router.navigate(['/empty/lang', lang]);
  }

  logout() {
    console.log('Logout clicked');
    this.router.navigate(['/dashboard']);
  }
}