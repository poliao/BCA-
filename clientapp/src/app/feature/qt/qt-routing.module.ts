import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '@app/core/guard/can-deactivate.guard';
import { Qtmt01Component } from './qtmt01/qtmt01.component';
import { Qtmt01Resolver } from './qtmt01/qtmt01-resolver.service';
import { Qtmt01DetailComponent } from './qtmt01/qtmt01-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'qtmt01',
        component: Qtmt01Component,
        resolve: { qtmt01: Qtmt01Resolver },
        data: { code: 'qtmt01' }
      },
      {
        path: 'qtmt01/detail',
        component: Qtmt01DetailComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve: { qtmt01: Qtmt01Resolver },
        data: { code: 'qtmt01' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class QtRoutingModule { }
