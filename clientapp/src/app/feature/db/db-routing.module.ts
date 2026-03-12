import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guard/can-deactivate.guard';

import { Dbmt01Component } from './dbmt01/dbmt01.component';
import { Dbmt02Component } from './dbmt02/dbmt02.component';
import { Dbmt03Component } from './dbmt03/dbmt03.component';
import { Dbmt07Component } from './dbmt07/dbmt07.component';

import { Dbmt01DetailComponent } from './dbmt01/dbmt01-detail.component';
import { Dbmt02DetailComponent } from './dbmt02/dbmt02-detail.component';
import { Dbmt03DetailComponent } from './dbmt03/dbmt03-detail.component';
import { Dbmt05Component } from './dbmt05/dbmt05.component';
import { Dbmt05Resolver } from './dbmt05/dbmt05-resolver.service';
import { Dbmt05DetailComponent } from './dbmt05/dbmt05-detail.component';
import { Dbmt06Component } from './dbmt06/dbmt06.component';
import { Dbmt06Resolver } from './dbmt06/dbmt06-resolver.service';
import { Dbmt06DetailComponent } from './dbmt06/dbmt06-detail.component';
import { Dbmt07DetailComponent } from './dbmt07/dbmt07-detail.component';

import { Dbmt01Resolver } from './dbmt01/dbmt01.resolver';
import { Dbmt02Resolver } from './dbmt02/dbmt02-resolver.service';
import { Dbmt03Resolver } from './dbmt03/dbmt03-resolver.service';
import { Dbmt07Resolver } from './dbmt07/dbmt07-resolver.service';
import { Dbmt04DetailComponent } from './dbmt04/dbmt04-detail.component';
import { Dbmt04Resolver } from './dbmt04/dbmt04-resolver.service';
import { Dbmt04Component } from './dbmt04/dbmt04.component';
import { Dbmt08Component } from './dbmt08/dbmt08.component';
import { Dbmt08Resolver } from './dbmt08/dbmt08.resolver';
import { Dbmt08DetailComponent } from './dbmt08/dbmt08-detail.component';
import { Dbmt081Component } from './dbmt08-1/dbmt08-1.component';
import { Dbmt081DetailComponent } from './dbmt08-1/dbmt08-1-detail.component';
import { Dbmt081Resolver } from './dbmt08-1/dbmt08-1.resolver';
import { Dbmt082Component } from './dbmt08-2/dbmt08-2.component';
import { Dbmt082DetailComponent } from './dbmt08-2/dbmt08-2-detail.component';
import { Dbmt082Resolver } from './dbmt08-2/dbmt08-2.resolver';

const routes: Routes = [
  {
    path: '',
    children: 
    [
      {
        path: 'dbmt01',
        component: Dbmt01Component,
        resolve: { dbmt01: Dbmt01Resolver },
        data: { code: 'dbmt01' }
      },
      {
        path: 'dbmt01/detail',
        component: Dbmt01DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt01: Dbmt01Resolver },
        data: { code: 'dbmt01' }
      },
      {
        path: 'dbmt02',
        component: Dbmt02Component,
        resolve: { dbmt02: Dbmt02Resolver },
        data: { code: 'dbmt02' }
      },
      {
        path: 'dbmt02/detail',
        component: Dbmt02DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt02: Dbmt02Resolver },
        data: { code: 'dbmt02' }
      },
      {
        path: 'dbmt03',
        component: Dbmt03Component,
        resolve: { dbmt03: Dbmt03Resolver },
        data: { code: 'dbmt03' }
      },
      {
        path: 'dbmt03/detail',
        component: Dbmt03DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt03: Dbmt03Resolver },
        data: { code: 'dbmt03' }
      },
      {
        path: 'dbmt05',
        component: Dbmt05Component,
        resolve: { dbmt05: Dbmt05Resolver },
        data: { code: 'dbmt05' }
      },
      {
        path: 'dbmt05/detail',
        component: Dbmt05DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt05: Dbmt05Resolver },
        data: { code: 'dbmt05' }
      },      {
        path: 'dbmt06',
        component: Dbmt06Component,
        resolve: { dbmt06: Dbmt06Resolver },
        data: { code: 'dbmt06' }
      },
      {
        path: 'dbmt06/detail',
        component: Dbmt06DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt06: Dbmt06Resolver },
        data: { code: 'dbmt06' }
      },
      {
        path: 'dbmt07',
        component: Dbmt07Component,
        resolve: { dbmt07: Dbmt07Resolver },
        data: { code: 'dbmt07' }
      },
      {
        path: 'dbmt07/detail',
        component: Dbmt07DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt07: Dbmt07Resolver },
        data: { code: 'dbmt07' }
      },
      {
        path: 'dbmt04',
        component: Dbmt04Component,
        resolve: { dbmt04: Dbmt04Resolver },
        data: { code: 'dbmt04' }
      },
      {
        path: 'dbmt04/detail',
        component: Dbmt04DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt04: Dbmt04Resolver },
        data: { code: 'dbmt04' }
      },{ path: 'dbmt08',
        component: Dbmt08Component,
        resolve: { dbmt08: Dbmt08Resolver },
        data: { code: 'dbmt08' }
      },
      {
        path: 'dbmt08/detail',
        component: Dbmt08DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt08: Dbmt08Resolver },
        data: { code: 'dbmt08' }
      },
      {
        path: 'dbmt08-1',
        component: Dbmt081Component,
        resolve: { dbmt081: Dbmt081Resolver },
        data: { code: 'dbmt08' }
      },
      {
        path: 'dbmt08-1/detail',
        component: Dbmt081DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt081: Dbmt081Resolver },
        data: { code: 'dbmt08' }
      },
      {
        path: 'dbmt08-2',
        component: Dbmt082Component,
        resolve: { dbmt082: Dbmt082Resolver },
        data: { code: 'dbmt08' }
      },
      {
        path: 'dbmt08-2/detail',
        component: Dbmt082DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { dbmt082: Dbmt082Resolver },
        data: { code: 'dbmt08' }
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DbRoutingModule { }
