import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { DbProvince } from './dbmt08.model';
import { Dbmt08Service } from './dbmt08.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Dbmt08Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt08Service = inject(Dbmt08Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];

  const auditLog = code?.provinceNameTHA == null
  ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null)
  : of(null);
  const detail = code?.provinceNameTHA
    ? forkJoin([
      db.getProvinceDetail(code.provinceNameTHA),
      authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, code.provinceNameTHA, new Date()),
    ]).pipe(map(([pId]) => pId))
    : of({} as Partial<DbProvince>);
    
  const master = db.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_,  master, detail, actions]) => ({  master, detail, actions }))
  );

 
};