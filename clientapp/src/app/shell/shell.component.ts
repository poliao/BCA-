import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, isDevMode, OnInit } from '@angular/core';

import { DOCUMENT } from '@angular/common';
import { AppConfigurationService } from '@app/core/services/app-configuration.service';
import { BackgroundService } from '@app/core/services/background.service';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { SidebarService } from './sidebar/sidebar.service';


@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
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
export class ShellComponent implements OnInit {

  constructor(
    public breakpointObserver: BreakpointObserver,
    public bs: BackgroundService,
    @Inject(DOCUMENT) private document: Document,
    private configuration: AppConfigurationService,
    private sidebarservice: SidebarService,
  ) { }

  isMediumScreen!: Observable<boolean>;
  timestamp = new Date(environment.timeStamp);
  showBanner = isDevMode();
  bannerColor = this.configuration.config.BannerColor;
  environment = this.configuration.config.environment;

  ngOnInit() {
    if (this.bs.status()) this.document.body.classList.add('background');
    else this.document.body.classList.remove('background');
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }
}