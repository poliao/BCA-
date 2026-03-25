import { inject } from '@angular/core';
import { ResolveFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SuMenu } from './sumt01.model';
import { Sumt01Service } from './sumt01.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt01Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const su: Sumt01Service = inject(Sumt01Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = code?.id == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null) : of(null);
  
  const detail = code?.id
    ? forkJoin([
      su.getMenu(code.id),
      authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.menuCode, new Date()),
    ]).pipe(map(([menu]) => menu))
    : of({} as Partial<SuMenu>);

  const master = su.getMenus();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_, master, detail, actions]) => ({ master, detail, actions }))
  );
};