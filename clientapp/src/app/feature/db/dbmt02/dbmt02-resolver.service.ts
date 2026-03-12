import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt02Service } from './dbmt02.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { Dbposition } from './dbmt02.model';
import { ActionType } from '@app/core/model/action-type';

export const Dbmt02Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt02Service = inject(Dbmt02Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];
  const auditLog = code?.PositionCode == null
    ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, null,null)
    : of(null);
  const detail = code?.PositionCode
    ? forkJoin([
        db.getPosiationDetail(code.PositionCode),
        authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Validate, code.PositionCode,new Date()),
      ]).pipe(map(([emp]) => emp))
    : of({} as Partial<Dbposition>);
  const master = db.getMaster();
  const actions = authorizeService.getActions(routeDataCode);
  return forkJoin([auditLog, detail, actions, master]).pipe(
    map(([_, detail, actions, master]) => ({ detail, actions, master }))
  );
};