import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SuMenu } from './sumt03.model';
import { Sumt03Service } from './sumt03.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt03Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const su: Sumt03Service = inject(Sumt03Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const routeDataCode = route.data['code'];
  const code = router.getCurrentNavigation()?.extras.state;
  const master = su.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  const auditLog = code?.menuCode == null
  ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null)
  : of(null);
  const detail = code?.menuCode 
  ? forkJoin([
        su.getMenu(code.menuCode, code.systemCode),
        authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.menuCode, new Date()),
      ]).pipe(map(([Menu]) => Menu)) 
    : of({ menuLabels: [] } as Partial<SuMenu>);
  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_, master, detail, actions]) => ({ master, detail, actions }))
  );
};
