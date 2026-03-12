import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { SuPasswordPolicy, Sumt05Service } from './sumt05.service';
import { AuthorizeActionService } from '@app/shared/service/authorize-action.service';
import { ActionType } from '@app/core/model/action-type';

export const Sumt05Resolver: ResolveFn<Observable<{ actions: any; detail: Partial<SuPasswordPolicy> }>> = (route: ActivatedRouteSnapshot) => {
  const su: Sumt05Service = inject(Sumt05Service);
  const authorizeService: AuthorizeActionService = inject(AuthorizeActionService);
  const routeDataCode = route.data['code'];
  const actions = authorizeService.getActions(routeDataCode);

  const detail = forkJoin([
                    su.getPolicy(),
                    authorizeService.saveaudit(routeDataCode.toUpperCase(), ActionType.Read, null, null),
                    ]).pipe(map(([Policy]) => Policy)); 

  return forkJoin([actions, detail]).pipe(
    map(([actions, detail]) => ({actions, detail }))
  ); 
};
