import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable, InjectionToken, OnDestroy } from '@angular/core';

export const OVERLAY_PARENT_HTML = new InjectionToken<string>('OVERLAY_PARENT_HTML');

@Injectable()
export class TooltipOverlayContainer extends OverlayContainer implements OnDestroy {

  override _createContainer(): void {
    const containerClass = 'cdk-overlay-container';

    const container = this._document.createElement('div');
    container.classList.add(containerClass);
    container.classList.add('overlay-tooltip');
    this._document.body.appendChild(container);
    this._containerElement = container;
  }
}