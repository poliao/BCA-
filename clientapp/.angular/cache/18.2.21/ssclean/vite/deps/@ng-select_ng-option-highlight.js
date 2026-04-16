import {
  Directive,
  ElementRef,
  Input,
  NgModule,
  Renderer2,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject
} from "./chunk-4HUZWRBS.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-3OV72XIM.js";

// node_modules/@ng-select/ng-option-highlight/fesm2022/ng-select-ng-option-highlight.mjs
var NgOptionHighlightDirective = class _NgOptionHighlightDirective {
  constructor(elementRef, renderer) {
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.element = this.elementRef.nativeElement;
  }
  get _canHighlight() {
    return this._isDefined(this.term) && this._isDefined(this.label);
  }
  ngOnChanges() {
    if (this._canHighlight) {
      this._highlightLabel();
    }
  }
  ngAfterViewInit() {
    this.label = this.element.innerHTML;
    if (this._canHighlight) {
      this._highlightLabel();
    }
  }
  _escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  _highlightLabel() {
    const label = this.label;
    if (!this.term) {
      this._setInnerHtml(label);
      return;
    }
    const alternationString = this._escapeRegExp(this.term).replace(" ", "|");
    const termRegex = new RegExp(alternationString, "gi");
    this._setInnerHtml(label.replace(termRegex, `<span class="highlighted">$&</span>`));
  }
  _setInnerHtml(html) {
    this.renderer.setProperty(this.elementRef.nativeElement, "innerHTML", html);
  }
  _isDefined(value) {
    return value !== void 0 && value !== null;
  }
  static {
    this.ɵfac = function NgOptionHighlightDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NgOptionHighlightDirective)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _NgOptionHighlightDirective,
      selectors: [["", "ngOptionHighlight", ""]],
      inputs: {
        term: [0, "ngOptionHighlight", "term"]
      },
      standalone: true,
      features: [ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgOptionHighlightDirective, [{
    type: Directive,
    args: [{
      selector: "[ngOptionHighlight]",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }], {
    term: [{
      type: Input,
      args: ["ngOptionHighlight"]
    }]
  });
})();
var NgOptionHighlightModule = class _NgOptionHighlightModule {
  static {
    this.ɵfac = function NgOptionHighlightModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NgOptionHighlightModule)();
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _NgOptionHighlightModule,
      imports: [NgOptionHighlightDirective],
      exports: [NgOptionHighlightDirective]
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({});
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgOptionHighlightModule, [{
    type: NgModule,
    args: [{
      imports: [NgOptionHighlightDirective],
      exports: [NgOptionHighlightDirective]
    }]
  }], null, null);
})();
export {
  NgOptionHighlightDirective,
  NgOptionHighlightModule
};
//# sourceMappingURL=@ng-select_ng-option-highlight.js.map
