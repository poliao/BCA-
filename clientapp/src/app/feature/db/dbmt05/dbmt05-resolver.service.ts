import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt05Service } from './dbmt05.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { DbBankAccountType } from './dbmt05.model';
import { ActionType } from '@app/core/model/action-type';

export const Dbmt05Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt05Service = inject(Dbmt05Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = code?.BankAccountTypeCode == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null) : of(null);

  const detail = code?.BankAccountTypeCode
    ? forkJoin([db.getBankAccountType(code.BankAccountTypeCode),
    authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.BankAccountTypeCode, new Date()),
    ]).pipe(map(([BankAccountType]) => BankAccountType))
    : of({} as Partial<DbBankAccountType>);

  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, actions, detail]).pipe(
    map(([_, actions, detail]) => ({ actions, detail }))
  );
};