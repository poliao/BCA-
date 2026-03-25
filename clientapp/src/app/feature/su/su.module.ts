import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyTranslationService } from '@app/core/translate-extension/lazy-translation.service';

import { SuRoutingModule } from './su-routing.module';

import { SharedModule } from '@app/shared/shared.module';
import { Sumt01DetailComponent } from './sumt01/sumt01-detail.component';
import { Sumt01Component } from './sumt01/sumt01.component';
import { Sumt01Service } from './sumt01/sumt01.service';
import { Sumt02DetailComponent } from './sumt02/sumt02-detail.component';
import { Sumt02Component } from './sumt02/sumt02.component';
import { Sumt02Service } from './sumt02/sumt02.service';
import { Sumt03DetailComponent } from './sumt03/sumt03-detail.component';
import { Sumt03Component } from './sumt03/sumt03.component';
import { Sumt03Service } from './sumt03/sumt03.service';
import { Sumt04DetailComponent } from './sumt04/sumt04-detail.component';
import { Sumt04MenuComponent } from './sumt04/sumt04-menu/sumt04-menu.component';
import { Sumt04Component } from './sumt04/sumt04.component';
import { Sumt04Service } from './sumt04/sumt04.service';
import { Sumt05DetailComponent } from './sumt05/sumt05-detail.component';
import { Sumt05Service } from './sumt05/sumt05.service';
import { Surt04DetailComponent } from './surt04/surt04-detail.component';
import { Surt04Component } from './surt04/surt04.component';
import { Surt04Service } from './surt04/surt04.service';
import { Sumt06DetailComponent } from './sumt06/sumt06-detail.component';
import { Sumt06Component } from './sumt06/sumt06.component';
import { Sumt06Service } from './sumt06/sumt06.service';
import { Surp04Component } from './surp04/surp04.component';
import { Surp04Service } from './surp04/surp04.service';
import { Surp03Component } from './surp03/surp03.component';
import { Surp03Service } from './surp03/surp03.service';
import { Surf01Component } from './surf01/surf01.component';
import { Surf01Service } from './surf01/surf01.service';
import { Surp02Component } from './surp02/surp02.component';
import { Surp02Service } from './surp02/surp02.service';
import { Surp02UserLookupComponent } from './surp02/surp02-user-lookup.component';
import { Surf01UserLookupComponent } from './surf01/surf01-user-lookup.component';
import { Sumt06CompanySelectComponet } from './sumt06/sumt06-company-select.component';
import { Sumt06OrganizationComponent } from './sumt06/sumt06-organization-component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    Sumt01Component, Sumt01DetailComponent,
    Sumt02Component, Sumt02DetailComponent,
    Sumt03Component, Sumt03DetailComponent,
    Sumt04Component, Sumt04DetailComponent, Sumt04MenuComponent,
    Surt04Component, Surt04DetailComponent,
    Sumt06Component, Sumt06DetailComponent, Sumt06CompanySelectComponet, Sumt06OrganizationComponent,
    Sumt05DetailComponent,
    Surp04Component,
    Surp03Component,
    Surf01Component, Surf01UserLookupComponent,
    Surp02Component, Surp02UserLookupComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    SuRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    Sumt01Service,
    Sumt02Service,
    Sumt03Service,
    Sumt04Service,
    Surt04Service,
    Sumt06Service,
    Sumt05Service,
    Surp04Service,
    Surp03Service,
    Surf01Service,
    Surp02Service
  ]
})
export class SuModule {
  constructor(private readonly lazy: LazyTranslationService) {
    this.lazy.add('su');
  }
}
