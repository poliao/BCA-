import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmptyComponent } from './feature/empty/empty.component';
import { emptyResolver } from './feature/empty/empty.resolver';
import { Shell } from './shell/shell.service';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  Shell.childRoutes([
    { path: 'empty/lang/:code', component: EmptyComponent },
    { path: 'empty/company', component: EmptyComponent, resolve: { empty: emptyResolver } },
    { path: 'empty/org', component: EmptyComponent, resolve: { empty: emptyResolver } },
    { path: 'demo', loadChildren: () => import('./feature/demo/demo.module').then(m => m.DemoModule) },
    { path: 'dashboard', loadChildren: () => import('./feature/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'su', loadChildren: () => import('./feature/su/su.module').then(m => m.SuModule) },
    // { path: 'tr', loadChildren: () => import('./feature/tr/tr.module').then(m => m.TrModule) },
    { path: 'db', loadChildren: () => import('./feature/db/db.module').then(m => m.DbModule) },
  ]),
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
