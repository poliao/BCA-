import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { Qtmt01Service } from './qtmt01.service';
import { ActionType } from '@app/core/model/action-type';
import { Qtmt01 } from './qtmt01.model';

export const Qtmt01Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Qtmt01Service = inject(Qtmt01Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = code?.id == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null) : of(null);

  const detail = code?.id
    ? forkJoin([db.getQuotation(code.id),
    authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.quotationNo, new Date()),
    ]).pipe(map(([quotation]) => quotation))
    : of(new Qtmt01());

  const master = db.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, actions, master, detail]).pipe(
    map(([_, actions, master, detail]) => ({ actions, master, detail }))
  );
};