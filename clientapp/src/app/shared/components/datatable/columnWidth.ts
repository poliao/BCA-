import { Directive, ElementRef, Input, Renderer2 } from '@angular/core'

@Directive({ selector: '[columnWidth]' })
export class ColumnWidthDirective {
  @Input() columnWidth = '';
  @Input() maxWidth = '';
  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) { }

  ngAfterContentInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'min-width', this.columnWidth);
    if (this.maxWidth) {
      this.renderer.setStyle(this.el.nativeElement, 'max-width', this.columnWidth);
    }
  }
}

