import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Surt04Service } from './surt04.service';

export const Surt04Resolver: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot, _) => {
  const router: Router = inject(Router);
  const su: Surt04Service = inject(Surt04Service);

  const extra = router.getCurrentNavigation()?.extras.state;
  const url = route.url.join('/');
  
  if (url === 'surt04/detail') {
    if (extra?.code) {
      return su.getConfiguration(extra.group, extra.code)
    } else {
      router.navigate(["/su/surt04"]);
      return of({});
    }
  }
  return su.getMaster();
};