import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum ScreenSize {
  Small = 768,
  Large = 1400
}

export type Menu = {
  menuCode?: string;
  title?: any;
  icon?: string;
  programCode?: string;
  active?: boolean;
  type?: string;
  url?: string;
  subMenus?: Menu[];
  authorizeds?: string[];
  badge?: any;
}

const demos: Menu[] = [
  {
    title: 'Demo',
    icon: 'fas fa-laptop-code',
    active: false,
    type: 'dropdown',
    subMenus: [
      { title: 'Layout', icon: 'far fa-circle fa-xs', url: '/demo/layout' },
      { title: 'Input', icon: 'far fa-circle fa-xs', url: '/demo/input' },
      { title: 'Table', icon: 'far fa-circle fa-xs', url: '/demo/datatable' },
      { title: 'Table Server', icon: 'far fa-circle fa-xs', url: '/demo/datatable-server' },
      { title: 'Table Multi Select', icon: 'far fa-circle fa-xs', url: '/demo/datatable-multi' },
      { title: 'Tree Select', icon: 'far fa-circle fa-xs', url: '/demo/tree' },
      { title: 'Report', icon: 'far fa-circle fa-xs', url: '/demo/report' }
    ]
  } as Menu
];

const problemMenu: Menu = {
  title: '',
  icon: 'fas fa-exclamation-triangle',
  active: false,
  type: 'dropdown',
  url: '/su/rppm01'
} as Menu;

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  toggled = false;
  _hasBackgroundImage = false;
  isMediumScreenObserv: Observable<boolean>;
  menuList?: Menu[];
  behaviorSubject = new BehaviorSubject<Menu[]>([]);

  constructor(public breakpointObserver: BreakpointObserver, private readonly http: HttpClient,private readonly translate: TranslateService) {
    this.isMediumScreenObserv = this.breakpointObserver
      .observe([`(max-width: ${ScreenSize.Large - 1}px)`])
      .pipe(map(state => state.matches))
    
  }

  toggle(): void {
    this.toggled = !this.toggled;
  }

  get currentMenu(): Menu {
    if (this.menuList) {
      let urlPart = window.location.href?.split('?');
      let url = window.location.href;
      if (urlPart && urlPart.length > 0) {
        url = urlPart[0];
      }
      return this.menuList?.find(x => url?.indexOf(x.url ?? "xxxxx") > 0);
    }
    return null;
  }

  flatten(data: Menu, result: Menu[]): Menu[] {
    result = result || [];
    if (!data) return result;

    if (!data.subMenus || data.subMenus.length == 0) {
      result.push(data);
    } else {
      for (const subMenu of data.subMenus) {
        if (!subMenu.subMenus || subMenu.subMenus.length == 0) {
          result.push(subMenu);
        } else {
          this.flatten(subMenu, result);
        }
      }
    }

    return result;
  }

  getSidebarState(): boolean {
    return this.toggled;
  }

  setSidebarState(state: boolean): void {
    this.toggled = state;
  }

  // getMenuList(): Observable<Menu[]> {
  //   return this.http.disableHeader().get<Menu[]>('menu').pipe(
  //     map(menus => {
  //       let allMenus = (!isDevMode() ? [] : demos).concat(menus);
  //       let result: Menu[] = [];
  //       for (const menu of allMenus) {
  //         this.flatten(menu, result);
  //       }
  //       this.menuList = result;
  //       this.behaviorSubject.next(this.menuList);
        
  //       return allMenus;
  //     })
  //   );
  // }

  getMenuList(lang): Observable<Menu[]> {
    return this.http.disableHeader().get<any[]>('v1/menus/all').pipe(
      map(menus => {
        // Map backend fields to frontend fields
        let mappedMenus: Menu[] = menus.map(m => ({
          ...m,
          title: (lang?.toLowerCase() === 'th') ? m.menuNameTh : m.menuNameEn, // Map based on lang
          active: false,
          subMenus: []
        }));

        // Build hierarchy
        const menuMap = new Map<number | string, Menu>();
        const roots: Menu[] = [];

        mappedMenus.forEach(menu => {
          menuMap.set(menu['id'] || menu.menuCode, menu);
        });

        mappedMenus.forEach(menu => {
          const parentId = menu['parentId'];
          if (parentId && menuMap.has(parentId)) {
            const parent = menuMap.get(parentId);
            parent.subMenus = parent.subMenus || [];
            parent.subMenus.push(menu);
          } else {
            roots.push(menu);
          }
        });

        let allMenus = (!isDevMode() ? [] : demos).concat(roots);
        problemMenu.title = this.translate.instant('message.STD00052');
        allMenus = allMenus.concat(problemMenu);
        
        const clearActive = (items: Menu[]): Menu[] => {
          return items.map(menu => ({
            ...menu,
            active: false,
            subMenus: menu.subMenus ? clearActive(menu.subMenus) : []
          }));
        };
        allMenus = clearActive(allMenus);

        let result: Menu[] = [];
        for (const menu of allMenus) {
          this.flatten(menu, result);
        }
        this.menuList = result;
        this.behaviorSubject.next(this.menuList);
        
        return allMenus;
      })
    );
  }

  get hasBackgroundImage(): boolean {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage: boolean) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}