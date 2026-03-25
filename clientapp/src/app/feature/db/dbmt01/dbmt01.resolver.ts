import { inject } from '@angular/core';
import { ResolveFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { DbLanguage } from './dbmt01.model';
import { Dbmt01Service } from './dbmt01.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Dbmt01Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt01Service = inject(Dbmt01Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const state = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null);
  
  const detail = state?.language
    ? of(state.language as DbLanguage)
    : of({ isActive: true } as Partial<DbLanguage>);

  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, detail, actions]).pipe(
    map(([_, detail, actions]) => ({ detail, actions }))
  );
};
