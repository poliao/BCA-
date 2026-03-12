import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { of } from 'rxjs';

export const emptyResolver: ResolveFn<{ [k: string]: any }> = () => {
  const router = inject(Router);
  const extra = router.getCurrentNavigation()?.extras.state;
  return of(extra ?? {});
};
