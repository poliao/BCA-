import { Component } from '@angular/core';
import { ActivatedRoute, GuardsCheckEnd, NavigationCancel, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { BackgroundService } from './core/services/background.service';
import { I18nService } from './core/services/i18n.service';
import { LoadingService } from './core/services/loading.service';
import { UpdateService } from './core/services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ss-clean';
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly update: UpdateService,
    private readonly i18n: I18nService,
    private readonly router: Router,
    private readonly ls: LoadingService,
    private readonly bs: BackgroundService,
  ) { }

  ngOnInit() {
    this.update.init();
    this.i18n.init();
    
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((evt) => {
      //block ui when lazyloading start
      if (evt instanceof RouteConfigLoadStart || evt instanceof GuardsCheckEnd) {
        this.ls.show();
      } else if (evt instanceof RouteConfigLoadEnd || evt instanceof NavigationEnd || evt instanceof NavigationCancel) {
        this.ls.hide();
      }
    });

    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    onNavigationEnd.pipe(
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      switchMap(route => route.data),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(event => {
      if (event.bg) this.bs.setStatus(true);
      else this.bs.setStatus(false);
    });
  }

  ngOnDestroy() {
    this.i18n.destroy();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
