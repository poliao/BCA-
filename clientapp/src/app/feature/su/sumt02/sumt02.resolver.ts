import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SuCompany } from './sumt02.model';
import { Sumt02Service } from './sumt02.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt02Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const su: Sumt02Service = inject(Sumt02Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];
  const master = su.getMaster();
  const actions = authorizeService.getActions(routeDataCode);
  
  const auditLog = code?.companyCode == null
  ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null)
  : of(null);
  const detail = code?.companyCode 
  ? forkJoin([
        su.getCompany(code.companyCode),
        authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.companyCode, new Date()),
      ]).pipe(map(([company]) => company)) 
    : of({} as Partial<SuCompany>);
  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_, master, detail, actions]) => ({ master, detail, actions }))
  );
};


