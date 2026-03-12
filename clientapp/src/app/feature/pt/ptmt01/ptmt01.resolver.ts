import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt01Service } from './ptmt01.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';
import { DbEmployee } from '@app/feature/db/dbmt01/dbmt01.model';

export const Dbmt01Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt01Service = inject(Dbmt01Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);

  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];
  // const detail = code?.empCode ? db.getEmployee(code.empCode) : of({} as Partial<DbEmployee>);

  const auditLog = code?.employeeCode == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null) : of(null);

  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, actions]).pipe(
    map(([_, actions]) => ({ actions }))
  );
};
