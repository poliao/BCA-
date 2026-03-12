import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, last, map, of } from 'rxjs';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { Surp02Service } from './surp02.service';
import { ActionType } from '@app/core/model/action-type';

export const Surp02Resolver: ResolveFn<Observable<any>> = (route) => {
  const router: Router = inject(Router);
  const su: Surp02Service = inject(Surp02Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const routeDataCode = route.data['code'];
  const auditLog = authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Access, null, null);
  const actions = authorizeService.getActions(routeDataCode);
  const master = su.getMaster();

  return forkJoin([auditLog,master, actions])
    .pipe(map(([_, master, actions]) => {
      return { master, actions };
    }));
};