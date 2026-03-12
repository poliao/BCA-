import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { DbDistrict } from './dbmt08-1.model';
import { Dbmt081Service } from './dbmt08-1.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Dbmt081Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt081Service = inject(Dbmt081Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];
  const provinceId = code ? code.provinceId : route.paramMap.get('ProvinceId');
  const districtId = code ? code.districtId : route.paramMap.get('DistrictId');
  const CreatePId = route.paramMap.get('CreatePId');

  const auditLog = code?.provinceId == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null) : of(null);

  const detail = provinceId
    ? forkJoin([
      db.getDistrictDetail(provinceId, districtId, null),
      authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, districtId ? districtId : null, new Date()),
    ]).pipe(map(([pId]) => pId))
    : of({} as Partial<DbDistrict>);
    
  const master = db.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_,  master, detail, actions]) => ({  master, detail, actions, CreatePId }))
  );

 
};