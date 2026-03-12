import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt04Service } from './dbmt04.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';
import { Bank } from './dbmt04.model';

export const Dbmt04Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt04Service = inject(Dbmt04Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = code?.BankCode == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null): of(null);

  const detail = code?.BankCode
  ? forkJoin([
    db.getBankDetail(code.BankCode),
    authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.BankCode, new Date()),
  ]).pipe(map(([emp]) => emp)) : of({ bankbranch: [] } as Bank);
 
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, detail, actions]).pipe(
    map(([_, detail, actions]) => ({detail, actions }))
  );
};
