import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyTranslationService } from '@app/core/translate-extension/lazy-translation.service';


import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { Qtmt01 } from './qtmt01/qtmt01.model';
import { Qtmt01Component } from './qtmt01/qtmt01.component';
import { Qtmt01DetailComponent } from './qtmt01/qtmt01-detail.component';
import { Qtmt01RdLookupComponent } from './qtmt01/qtmt01-rd-lookup.component';
import { Qtmt01Service } from './qtmt01/qtmt01.service';
import { QtRoutingModule } from './qt-routing.module';
import { Qtmt01PaperCutDialogComponent } from './qtmt01/qtmt01-paper-cut-dialog.component';
import { Qtmt01PostPrintDialogComponent } from './qtmt01/qtmt01-post-print-dialog.component';


@NgModule({
  declarations: [
    Qtmt01Component, Qtmt01DetailComponent, Qtmt01RdLookupComponent, Qtmt01PaperCutDialogComponent, Qtmt01PostPrintDialogComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    QtRoutingModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatIconModule,
    MatSortModule,
    MatRadioModule,
    MatExpansionModule
  ],
  providers: [
    Qtmt01Service,

  ]
})
export class QtModule {
  constructor(private readonly lazy: LazyTranslationService) {
    this.lazy.add('qt');
  }
}
