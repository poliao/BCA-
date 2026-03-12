import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyTranslationService } from '@app/core/translate-extension/lazy-translation.service';

import { DbRoutingModule } from './db-routing.module';

import { SharedModule } from '@app/shared/shared.module';

import { Dbmt01Component } from './dbmt01/dbmt01.component';
import { Dbmt02Component } from './dbmt02/dbmt02.component';
import { Dbmt03Component } from './dbmt03/dbmt03.component';
import { Dbmt05Component } from './dbmt05/dbmt05.component';
import { Dbmt06Component } from './dbmt06/dbmt06.component';
import { Dbmt07Component } from './dbmt07/dbmt07.component';

import { Dbmt01DetailComponent } from './dbmt01/dbmt01-detail.component';
import { Dbmt02DetailComponent } from './dbmt02/dbmt02-detail.component';
import { Dbmt03DetailComponent } from './dbmt03/dbmt03-detail.component';
import { Dbmt05DetailComponent } from './dbmt05/dbmt05-detail.component';
import { Dbmt06DetailComponent } from './dbmt06/dbmt06-detail.component';
import { Dbmt07DetailComponent } from './dbmt07/dbmt07-detail.component';

import { Dbmt01Service } from './dbmt01/dbmt01.service';
import { Dbmt02Service } from './dbmt02/dbmt02.service';
import { Dbmt03Service } from './dbmt03/dbmt03.service';
import { Dbmt05Service } from './dbmt05/dbmt05.service';
import { Dbmt06Service } from './dbmt06/dbmt06.service';
import { Dbmt07Service } from './dbmt07/dbmt07.service';
import { Dbmt04Service } from './dbmt04/dbmt04.service';
import { Dbmt04DetailComponent } from './dbmt04/dbmt04-detail.component';
import { Dbmt04Component } from './dbmt04/dbmt04.component';
import { Dbmt08Component } from './dbmt08/dbmt08.component';
import { Dbmt08DetailComponent } from './dbmt08/dbmt08-detail.component';
import { Dbmt08Service } from './dbmt08/dbmt08.service';
import { Dbmt081Component } from './dbmt08-1/dbmt08-1.component';
import { Dbmt081DetailComponent } from './dbmt08-1/dbmt08-1-detail.component';
import { Dbmt081Service } from './dbmt08-1/dbmt08-1.service';
import { Dbmt082Component } from './dbmt08-2/dbmt08-2.component';
import { Dbmt082DetailComponent } from './dbmt08-2/dbmt08-2-detail.component';
import { Dbmt082Service } from './dbmt08-2/dbmt08-2.service';

@NgModule({
  declarations: [
    Dbmt01Component, Dbmt01DetailComponent,
    Dbmt02Component, Dbmt02DetailComponent,
    Dbmt03Component, Dbmt03DetailComponent,
    Dbmt05Component, Dbmt05DetailComponent,
    Dbmt06Component, Dbmt06DetailComponent,
    Dbmt07Component, Dbmt07DetailComponent,
    Dbmt04Component, Dbmt04DetailComponent,
    Dbmt08Component, Dbmt08DetailComponent,
    Dbmt081Component, Dbmt081DetailComponent,
    Dbmt082Component, Dbmt082DetailComponent
  ],
  imports: [
    CommonModule,
    DbRoutingModule,
    SharedModule
  ],
  providers: [
    Dbmt01Service,
    Dbmt02Service,
    Dbmt03Service,
    Dbmt05Service,
    Dbmt06Service,
    Dbmt07Service,
    Dbmt04Service,
    Dbmt08Service,
    Dbmt081Service,
    Dbmt082Service
  ]
})
export class DbModule {
  constructor(private readonly lazy: LazyTranslationService) {
    this.lazy.add('db');
  }
}
