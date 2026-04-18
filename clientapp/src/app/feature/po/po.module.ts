import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyTranslationService } from '@app/core/translate-extension/lazy-translation.service';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { Pomt01DetailComponent } from './pomt01/pomt01-detail.component';
import { Pomt01Component } from './pomt01/pomt01.component';
import { Pomt01Service } from './pomt01/pomt01.service';
import { Pomt02DetailComponent } from './pomt02/pomt02-detail.component';
import { Pomt02Component } from './pomt02/pomt02.component';
import { Pomt02Service } from './pomt02/pomt02.service';
import { PoRoutingModule } from './po-routing.module';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    Pomt01Component, Pomt01DetailComponent,
    Pomt02Component, Pomt02DetailComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    PoRoutingModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatIconModule,
    MatSortModule,
    MatRadioModule,
    MatTabsModule
  ],
  providers: [
    Pomt01Service,
    Pomt02Service
  ]
})
export class PoModule {
  constructor(private readonly lazy: LazyTranslationService) {
    this.lazy.add('po');
  }
}
