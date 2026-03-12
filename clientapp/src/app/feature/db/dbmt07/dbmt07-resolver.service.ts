import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt07Service } from './dbmt07.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { DbCountry } from './dbmt07.model';
import { ActionType } from '@app/core/model/action-type';

export const Dbmt07Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt07Service = inject(Dbmt07Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = code?.countryCode == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null ,null) : of(null);
  const detail = code?.countryCode
    ? forkJoin([
      db.getCountry(code.countryCode),
      authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.countryCode ,new Date()),
    ]).pipe(map(([Country]) => Country))
    : of({} as Partial<DbCountry>);

  const master = db.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, actions, detail, master]).pipe(
    map(([_,  actions, detail, master]) => ({  actions, detail, master }))
  );
};
