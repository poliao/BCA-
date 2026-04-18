import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guard/can-deactivate.guard';
import { Pomt01Component } from './pomt01/pomt01.component';
import { Pomt01Resolver } from './pomt01/pomt01-resolver.service';
import { Pomt01DetailComponent } from './pomt01/pomt01-detail.component';
import { Pomt02Component } from './pomt02/pomt02.component';
import { Pomt02Resolver } from './pomt02/pomt02-resolver.service';
import { Pomt02DetailComponent } from './pomt02/pomt02-detail.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pomt01',
        component: Pomt01Component,
        resolve: { pomt01: Pomt01Resolver },
        data: { code: 'pomt01' }
      },
      {
        path: 'pomt01/detail',
        component: Pomt01DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { pomt01: Pomt01Resolver },
        data: { code: 'pomt01' }
      },
      {
        path: 'pomt02',
        component: Pomt02Component,
        resolve: { pomt02: Pomt02Resolver },
        data: { code: 'pomt02' }
      },
      {
        path: 'pomt02/detail',
        component: Pomt02DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { pomt02: Pomt02Resolver },
        data: { code: 'pomt02' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PoRoutingModule { }
