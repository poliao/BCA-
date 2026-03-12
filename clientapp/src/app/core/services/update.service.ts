import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  constructor(
    private appRef: ApplicationRef,
    private swUpdate: SwUpdate,
    private toast: ToastrService
  ) { }

  private forceUpdate(): void {
    this.toast.info("Update Available", "Reload", {
      disableTimeOut: true,
      positionClass: 'toast-bottom-right'
    }).onTap.subscribe(() => {
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    })
  }

  public init(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        switch (event.type) {
          case 'VERSION_DETECTED':
            console.log(`Downloading new app version: ${event.version.hash}`);
            break;
          case 'VERSION_READY':
            console.log(`Current app version: ${event.currentVersion.hash}`);
            console.log(`New app version ready for use: ${event.latestVersion.hash}`);
            this.forceUpdate();
            break;
          case 'VERSION_INSTALLATION_FAILED':
            console.log(`Failed to install app version '${event.version.hash}': ${event.error}`);
            break;
        }
      });

      const appIsStable = this.appRef.isStable.pipe(first(isStable => isStable === true));
      const everyDelay = interval(6 * 60 * 60);
      const everyDelayOnceAppIsStable = concat(appIsStable, everyDelay);
      console.log("begin Check..");
      everyDelayOnceAppIsStable.subscribe((i) => {
        console.log('in interval ' + i)
        this.swUpdate.checkForUpdate().then(() => console.log("checking for new version.."))
      });
    }
  }
}