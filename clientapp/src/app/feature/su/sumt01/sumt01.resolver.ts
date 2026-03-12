import { inject } from '@angular/core';
import { ResolveFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SuSystem } from './sumt01.model';
import { Sumt01Service } from './sumt01.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt01Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const su: Sumt01Service = inject(Sumt01Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = code?.systemCode == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null) : of(null);
  
  const detail = code?.systemCode
    ? forkJoin([
      su.getSystem(code.systemCode),
      authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.systemCode, new Date()),
    ]).pipe(map(([system]) => system))
    : of({} as Partial<SuSystem>);

  const master = su.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_, master, detail, actions]) => ({ master, detail, actions }))
  );
};