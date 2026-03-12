import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SuProfile } from './sumt04.model';
import { Sumt04Service } from './sumt04.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt04Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const su: Sumt04Service = inject(Sumt04Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const routeDataCode = route.data['code'];
  const extra = router.getCurrentNavigation()?.extras.state;
  const master = su.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  const auditLog = extra?.code == null? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null): of(null);

  const detail = extra?.code
  ? forkJoin([
        su.getProfile(extra.code),
        authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, extra.code, new Date()),
      ]).pipe(map(([Profile]) => Profile))
    : of({ profileLangs : [] } as Partial<SuProfile>);
  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_, master, detail, actions]) => ({ master, detail, actions }))
  );
};
