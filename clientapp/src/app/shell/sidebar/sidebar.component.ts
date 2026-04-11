import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@app/core/services/loading.service';
import { Observable, Subscription, of } from 'rxjs';
import { Menu, SidebarService } from './sidebar.service';
import { ActivatedRoute } from '@angular/router';
import { I18nService } from '@app/core/services/i18n.service';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {
  menusList!: Observable<Menu[]>;
  personalName?: Observable<string>;
  userName?: Observable<string>;
  isMediumScreen!: boolean;
  isMediumScreenSub!: Subscription;
  constructor(
    public sidebarservice: SidebarService,
    private readonly loading: LoadingService,
    private route: ActivatedRoute,
    private i18n: I18nService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    window.addEventListener('refresh-menu', this.handleMenuRefresh);

    const profile = this.authService.userProfile;
    if (profile) {
      this.userName = of(profile.username || "Guest");
      this.personalName = of(`${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username || "Administrator");
    } else {
      this.userName = of("Guest");
      this.personalName = of("Administrator");
    }

    this.menusList = this.sidebarservice.getMenuList(this.i18n.language);
    this.isMediumScreenSub = this.sidebarservice.isMediumScreenObserv.subscribe(medium => this.isMediumScreen = medium);
  }

  handleMenuRefresh = (event: Event) => {
    this.menusList = this.sidebarservice.getMenuList(this.i18n.language);
  };

  ngOnDestroy(): void {
    window.removeEventListener('refresh-menu', this.handleMenuRefresh);
    if (this.isMediumScreenSub) this.isMediumScreenSub.unsubscribe();
  }

  toggle(menus: Menu[], currentMenu: Menu, level: number): void {
    if (currentMenu?.subMenus?.length && level == 1) {
      menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
    else if (currentMenu?.subMenus?.length && level > 1) {
      currentMenu.active = !currentMenu.active;
    }
  }

  hide(): void {
    if (this.isMediumScreen) {
      this.sidebarservice.toggle();
    }
  }

  haveChildren(menu: Menu): boolean {
    return menu.subMenus && menu.subMenus.length > 0;
  }

  hasBackgroundImage(): boolean {
    return this.sidebarservice.hasBackgroundImage;
  }

  async signOut(): Promise<void> {
    // Basic sign out - maybe just go to a landing page or do nothing
    console.log('Sign out clicked');
  }
}
