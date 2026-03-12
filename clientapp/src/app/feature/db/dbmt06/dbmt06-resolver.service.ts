import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt06Service } from './dbmt06.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { DbPrefix } from './dbmt06.model';
import { ActionType } from '@app/core/model/action-type';

export const Dbmt06Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt06Service = inject(Dbmt06Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = code?.PrefixId == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null) : of(null);

  const detail = code?.PrefixId
    ? forkJoin([db.getPrefix(code.PrefixId),
    authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.PrefixId.toString(), new Date()),
    ]).pipe(map(([DbPrefix]) => DbPrefix))
    : of({} as Partial<DbPrefix>);

  const master = db.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, actions, detail, master]).pipe(
    map(([_, actions, detail, master]) => ({ actions, detail, master }))
  );
};