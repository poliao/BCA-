import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { inject } from '@angular/core';
import { Pomt01Service } from './pomt01.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';
import { Pomt01 } from './pomt01.model';

export const Pomt01Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Pomt01Service = inject(Pomt01Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const state = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = state?.id == null
    ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, null, null)
    : of(null);

  const detail = state?.id
    ? forkJoin([
        db.getCategoryDetail(state.id),
        authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Validate, state.id.toString(), new Date()),
      ]).pipe(map(([res]) => res))
    : of({ active: true } as Partial<Pomt01>);

  const actions = authorizeService.getActions(routeDataCode);
  const master = db.getMaster();

  return forkJoin([auditLog, detail, actions, master]).pipe(
    map(([_, detail, actions, master]) => ({ 
      detail, 
      actions, 
      master: master.categories
    }))
  );
};