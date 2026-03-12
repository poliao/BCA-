import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService, SupportedLanguages } from '@app/core/services/i18n.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [],
  template: ''
})

export class EmptyComponent {
  private langChangedSubscription!: Subscription;
  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    if (this.router.url.includes('/lang')) {
      this.langChangedSubscription = this.i18n.onLangChanged.subscribe(() => this.location.back());
      const lang = this.route.snapshot.paramMap.get('code');
      this.i18n.language = lang ?? SupportedLanguages.Eng;
    }
    else if (this.router.url.includes('/company') || this.router.url.includes('/org')) {
      this.route.data.subscribe((data) => {
        this.router.navigate([data.empty.callbackUrl]);
      })
    }
    else {
      this.location.back();
    } 
  }

  ngOnDestroy() {
    if (this.langChangedSubscription) {
      this.langChangedSubscription.unsubscribe();
      window.dispatchEvent(new Event('refresh-menu'));
    }
  }
}
