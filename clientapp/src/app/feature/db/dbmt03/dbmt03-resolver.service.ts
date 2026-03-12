import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt03Service } from './dbmt03.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';
import { Dbdepartment } from './dbmt03.model';

export const Dbmt03Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt03Service = inject(Dbmt03Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];
  const auditLog = code?.departmentCode == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null) : of(null);
  const detail = code?.departmentCode
    ? forkJoin([
      db.getDepartment(code.departmentCode),
      authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.departmentCode, new Date()),
    ]).pipe(map(([Department]) => Department))
    : of({} as Partial<Dbdepartment>);

  const master = db.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, actions, detail, master]).pipe(
    map(([_, actions, detail, master]) => ({ actions, detail, master }))
  );
};