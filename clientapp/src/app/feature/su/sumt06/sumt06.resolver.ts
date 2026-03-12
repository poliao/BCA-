import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { SuUser, Sumt06Service } from './sumt06.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt06Resolver: ResolveFn<Observable<any>> = (route) => {
  const router: Router = inject(Router);
  const su: Sumt06Service = inject(Sumt06Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const routeDataCode = route.data['code'];
  const extra = router.getCurrentNavigation()?.extras.state;
  const url = route.url.join('/');
  const actions = authorizeService.getActions(routeDataCode);

  if (url === 'sumt06') {
    const master = su.getMaster('inquiry');
    const user = extra?.id
      ? su.getUser(extra.id)
      : of({ userProfiles: [] } as Partial<SuUser>);

    return forkJoin([user, master, actions]).pipe(
      switchMap(([user, master, actions]) => {
        const auditLog = authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null);
        return forkJoin([auditLog, of(user), of(master), of(actions)]).pipe(
          map(([_, user, master, actions]) => ({ user, master, actions }))
        );
      })
    );
  } else if (url === 'sumt06/detail') {
    const master = su.getMaster('save');
    const user = extra?.id
      ? su.getUser(extra.id)
      : of({ userProfiles: [] } as Partial<SuUser>);

    return forkJoin([user, master, actions]).pipe(
      switchMap(([user, master, actions]) => {
        const auditLog = authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, user.userName, new Date());
        return forkJoin([auditLog, of(user), of(master), of(actions)]).pipe(
          map(([_, user, master, actions]) => ({ user, master, actions }))
        );
      })
    );
  }else if (url === 'sumt06/detail/organization') {
    const master = su.getMaster('save');
    const department = extra?.mainCompany
      ? su.getDepartment(extra.mainCompany)
      : of({ userProfiles: [] } as Partial<SuUser>);

    const departmentDetail =  extra?.id ? su.getDepartmentDtail(extra.mainCompany, extra.id)
    : of({ userProfiles: [] } as Partial<SuUser>);
    
    return forkJoin([department, master, actions,departmentDetail]).pipe(
      switchMap(([department, master, actions, departmentDetail]) => {
        const auditLog = authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, department.userName, new Date());
        return forkJoin([auditLog, of(department), of(master), of(actions), of(departmentDetail)]).pipe(
          map(([_, department, master, actions, departmentDetail]) => ({ department, master, actions, departmentDetail }))
        );
      })
    );
  }

  const auditLog = authorizeService.saveaudit(routeDataCode.toUpperCase(),ActionType.Read, null, null);
  return forkJoin([auditLog, actions]).pipe(
    map(([auditLog, actions]) => ({ auditLog, actions }))
  );
};
