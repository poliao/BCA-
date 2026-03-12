import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { DbSubDistrict } from './dbmt08-2.model';
import { Dbmt082Service } from './dbmt08-2.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Dbmt082Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot) => {
  const router: Router = inject(Router);
  const db: Dbmt082Service = inject(Dbmt082Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const code = router.getCurrentNavigation()?.extras.state;
  const routeDataCode = route.data['code'];
  const districtId = code ? code.districtId : route.paramMap.get('DistrictId');
  const subDistrictId = code ? code.subDistrictId : route.paramMap.get('SubDistrictId');
  const CreateDId = route.paramMap.get('CreateDId');

  const auditLog = code?.subDistrictId == null ? authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, null, null) : of(null);
  
  const detail = districtId
    ? forkJoin([
      db.getSubDistrictDetail(districtId, subDistrictId, null),
      authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, subDistrictId ? subDistrictId : null, new Date()),
    ]).pipe(map(([dId]) => dId))
    : of({} as Partial<DbSubDistrict>);
    
  const master = db.getMaster();
  const actions = authorizeService.getActions(routeDataCode);

  return forkJoin([auditLog, master, detail, actions]).pipe(
    map(([_, master, detail, actions]) => ({  master, detail, actions, CreateDId }))
  );

 
};