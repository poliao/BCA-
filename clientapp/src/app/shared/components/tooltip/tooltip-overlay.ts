import { Directionality } from "@angular/cdk/bidi";
import { Overlay, OverlayKeyboardDispatcher, OverlayOutsideClickDispatcher, OverlayPositionBuilder, ScrollStrategyOptions } from "@angular/cdk/overlay";
import { DOCUMENT, Location } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable, Injector, NgZone } from "@angular/core";
import { TooltipOverlayContainer } from "./tooltop-overlay-container";

//https://github.com/angular/components/issues/17024
@Injectable()
export class TooltipOverlay extends Overlay {

    constructor(scrollStrategies: ScrollStrategyOptions,
        _overlayContainer: TooltipOverlayContainer,
        _componentFactoryResolver: ComponentFactoryResolver,
        _positionBuilder: OverlayPositionBuilder,
        _keyboardDispatcher: OverlayKeyboardDispatcher,
        _injector: Injector,
        _ngZone: NgZone,
        @Inject(DOCUMENT) _document: any,
        _directionality: Directionality,
        _location: Location,
        _outsideClickDispatcher: OverlayOutsideClickDispatcher) {

        super(scrollStrategies,
            _overlayContainer,
            _componentFactoryResolver,
            _positionBuilder,
            _keyboardDispatcher,
            _injector,
            _ngZone,
            _document,
            _directionality,
            _location,
            _outsideClickDispatcher);
    }

}
