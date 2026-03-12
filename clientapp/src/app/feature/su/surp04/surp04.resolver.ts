import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, last, map, of } from 'rxjs';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { Surp04Service } from './surp04.service';
import { ActionType } from '@app/core/model/action-type';

export const Surp04Resolver: ResolveFn<Observable<any>> = (route) => {
  const router: Router = inject(Router);
  const su: Surp04Service = inject(Surp04Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const routeDataCode = route.data['code'];
  const actions = authorizeService.getActions(routeDataCode);
  const master = su.getMaster();
  const auditLog = authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null);
  
  return forkJoin([auditLog, actions, master])
  .pipe(map(([_, actions, master]) => {
    return { actions, master };
  }));
};