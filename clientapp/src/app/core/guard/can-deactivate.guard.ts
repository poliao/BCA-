import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class SkipDeactivateGuard {
  private isCanceled = false;

  get canceled() {
    return this.isCanceled
  }

  set canceled(value: boolean) {
    this.isCanceled = value;
  }
}

export const CanDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate,
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {
  const skip = inject(SkipDeactivateGuard);
  const sameUrl = state.url === nextState.url;
  if (skip.canceled === true) {
    skip.canceled = false;
    if (sameUrl) return false;
  }

  if (component.canDeactivate) {
    const result = component.canDeactivate();
    if (typeof result == "boolean") {
      return result;
    }
    else {
      return result.pipe(
        tap(confirm => {
          if (sameUrl === false && confirm === false) {
            skip.canceled = true;
          }
        })
      )
    }
  }
  else return true;
};

export type CanComponentDeactivate = {
  canDeactivate: () => Observable<boolean> | boolean;
}