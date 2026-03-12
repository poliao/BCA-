import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipOverlay } from './tooltip-overlay';
import { Tooltip } from './tooltip.directive';
import { TooltipOverlayContainer } from './tooltop-overlay-container';
 
@NgModule({
  declarations: [Tooltip],
  imports: [
    CommonModule,
    MatTooltipModule,
    TranslateModule,
  ],
  exports: [
    Tooltip
  ],
  providers: [
    TooltipOverlay,
    TooltipOverlayContainer,
    { provide:MAT_TOOLTIP_DEFAULT_OPTIONS,useValue:{ position : 'above' }}
  ]
})
export class TooltipModule { }
