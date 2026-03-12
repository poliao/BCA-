import { AriaDescriber, FocusMonitor } from "@angular/cdk/a11y";
import { Directionality } from "@angular/cdk/bidi";
import { Platform } from "@angular/cdk/platform";
import { ScrollDispatcher } from "@angular/cdk/scrolling";
import { DOCUMENT } from "@angular/common";
import { Directive, ElementRef, Inject, NgZone, Optional, ViewContainerRef } from "@angular/core";
import { MatTooltip, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from "@angular/material/tooltip";
import { TooltipOverlay } from "./tooltip-overlay";

@Directive({
    selector: '[matTooltip]',
    exportAs: 'matTooltip',
    host: {
      'class': 'mat-tooltip-trigger',
    },
  })
  export class Tooltip extends MatTooltip {
     
    constructor(
      overlay: TooltipOverlay,
      elementRef: ElementRef<HTMLElement>,
      scrollDispatcher: ScrollDispatcher,
      viewContainerRef: ViewContainerRef,
      ngZone: NgZone,
      platform: Platform,
      ariaDescriber: AriaDescriber,
      focusMonitor: FocusMonitor,
      @Inject(MAT_TOOLTIP_SCROLL_STRATEGY) scrollStrategy: any,
      @Optional() dir: Directionality,
      @Optional() @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS) defaultOptions: MatTooltipDefaultOptions,
      @Inject(DOCUMENT) _document: any,
    ) {
      super(
        overlay,
        elementRef,
        scrollDispatcher,
        viewContainerRef,
        ngZone,
        platform,
        ariaDescriber,
        focusMonitor,
        scrollStrategy,
        dir,
        defaultOptions,
        _document,
      );
    }
  }