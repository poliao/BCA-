import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { ProductionProcess } from './sumt03.model';
import { Sumt03Service } from './sumt03.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt03Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const su: Sumt03Service = inject(Sumt03Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const routeDataCode = route.data['code'];
  const state = router.getCurrentNavigation()?.extras.state;
  const master = su.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  const auditLog = state?.id == null
  ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null)
  : of(null);
  
  const detail = state?.id 
  ? forkJoin([
        su.getProcess(state.id),
        authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, state.id, new Date()),
      ]).pipe(map(([process]) => process)) 
    : of(new ProductionProcess());
    
  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_, master, detail, actions]) => ({ master, detail, actions }))
  );
};
