import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SuUser } from './sumt02.model';
import { Sumt02Service } from './sumt02.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt02Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const su: Sumt02Service = inject(Sumt02Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const state = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];
  const master = su.getMaster();
  const actions = authorizeService.getActions(routeDataCode);
  
  const auditLog = state?.id == null
  ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null)
  : of(null);

  const detail = state?.id 
  ? forkJoin([
        su.getUser(state.id),
        authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, state.id.toString(), new Date()),
      ]).pipe(map(([user]) => user)) 
    : of({} as Partial<SuUser>);

  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_, master, detail, actions]) => ({ master, detail, actions }))
  );
};


