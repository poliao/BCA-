import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guard/can-deactivate.guard';

import { Sumt01DetailComponent } from './sumt01/sumt01-detail.component';
import { Sumt01Component } from './sumt01/sumt01.component';
import { Sumt01Resolver } from './sumt01/sumt01.resolver';
import { Sumt02DetailComponent } from './sumt02/sumt02-detail.component';
import { Sumt02Component } from './sumt02/sumt02.component';
import { Sumt02Resolver } from './sumt02/sumt02.resolver';
import { Sumt03DetailComponent } from './sumt03/sumt03-detail.component';
import { Sumt03Component } from './sumt03/sumt03.component';
import { Sumt03Resolver } from './sumt03/sumt03.resolver';
import { Sumt04DetailComponent } from './sumt04/sumt04-detail.component';
import { Sumt04Component } from './sumt04/sumt04.component';
import { Sumt04Resolver } from './sumt04/sumt04.resolver';
import { Sumt05DetailComponent } from './sumt05/sumt05-detail.component';
import { Sumt05Resolver } from './sumt05/sumt05.resolver';
import { Surt04DetailComponent } from './surt04/surt04-detail.component';
import { Surt04Component } from './surt04/surt04.component';
import { Surt04Resolver } from './surt04/surt04.resolver';
import { Sumt06DetailComponent } from './sumt06/sumt06-detail.component';
import { Sumt06Component } from './sumt06/sumt06.component';
import { Sumt06Resolver } from './sumt06/sumt06.resolver';
import { Surp04Component } from './surp04/surp04.component';
import { Surp04Resolver } from './surp04/surp04.resolver';
import { Surp03Component } from './surp03/surp03.component';
import { Surp03Resolver } from './surp03/surp03.resolver';
import { Surf01Component } from './surf01/surf01.component';
import { Surf01Resolver } from './surf01/surf01.resolver';
import { Surp02Component } from './surp02/surp02.component';
import { Surp02Resolver } from './surp02/surp02.resolver';
import { Sumt06OrganizationComponent } from './sumt06/sumt06-organization-component';
import { Rppm01Component } from './problem/rppm01.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sumt01',
        component: Sumt01Component,
        resolve: { sumt01: Sumt01Resolver },
        data: { code: 'sumt01' }
      },
      {
        path: 'sumt01/detail',
        component: Sumt01DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { sumt01: Sumt01Resolver },
        data: { code: 'sumt01' }
      },
      {
        path: 'sumt02',
        component: Sumt02Component,
        resolve: { sumt02: Sumt02Resolver },
        data: { code: 'sumt02' }
      },
      {
        path: 'sumt02/detail',
        component: Sumt02DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { sumt02: Sumt02Resolver },
        data: { code: 'sumt02' }
      },
      {
        path: 'sumt03',
        component: Sumt03Component,
        resolve: { sumt03: Sumt03Resolver },
        data: { code: 'sumt03' }
      },
      {
        path: 'sumt03/detail',
        component: Sumt03DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { sumt03: Sumt03Resolver },
        data: { code: 'sumt03' }
      },
      {
        path: 'sumt04',
        component: Sumt04Component,
        resolve: { sumt04: Sumt04Resolver },
        data: { code: 'sumt04' }
      },
      {
        path: 'sumt04/detail',
        component: Sumt04DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { sumt04: Sumt04Resolver },
        data: { code: 'sumt04' }
      },
      {
        path: 'surt04',
        component: Surt04Component,
        resolve: { surt04: Surt04Resolver },
        data: { code: 'surt04' }
      },
      {
        path: 'surt04/detail',
        component: Surt04DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { surt04: Surt04Resolver },
        data: { code: 'surt04' }
      },
      {
        path: 'sumt06',
        component: Sumt06Component,
        resolve: { sumt06: Sumt06Resolver },
        data: { code: 'sumt06' }
      },
      {
        path: 'sumt06/detail',
        component: Sumt06DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { sumt06: Sumt06Resolver },
        data: { code: 'sumt06' }
      },
      {
        path: 'sumt06/detail/organization',
        component: Sumt06OrganizationComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { sumt06: Sumt06Resolver },
        data: { code: 'sumt06' }
      },
      {
        path: 'sumt05',
        component: Sumt05DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { sumt05: Sumt05Resolver },
        data: { code: 'sumt05' }
      },
      {
        path: 'surp04',
        component: Surp04Component,
        resolve: { surp04: Surp04Resolver },
        data: { code: 'surp04' }
      },
      {
        path: 'surp03',
        component: Surp03Component,
        resolve: { surp03: Surp03Resolver },
        data: { code: 'surp03' }
      }, 
      {
        path: 'surf01',
        component: Surf01Component,
        resolve: { surf01: Surf01Resolver },
        data: { code: 'surf01' }
      }, 
      {
        path: 'surp02',
        component: Surp02Component,
        resolve: { surp02: Surp02Resolver },
        data: { code: 'surp02' }
      },
    ]
  },
  {
    path: 'rppm01',
    component: Rppm01Component,
    data: {
      code: 'rppm01',
      bg: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SuRoutingModule { }
