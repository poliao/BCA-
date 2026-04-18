import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmptyComponent } from './feature/empty/empty.component';
import { emptyResolver } from './feature/empty/empty.resolver';
import { Shell } from './shell/shell.service';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./feature/login/login.module').then(m => m.LoginModule) },
  {
    ...Shell.childRoutes([
      { path: 'empty/lang/:code', component: EmptyComponent },
      { path: 'empty/company', component: EmptyComponent, resolve: { empty: emptyResolver } },
      { path: 'empty/org', component: EmptyComponent, resolve: { empty: emptyResolver } },
      { path: 'demo', loadChildren: () => import('./feature/demo/demo.module').then(m => m.DemoModule) },
      { path: 'dashboard', loadChildren: () => import('./feature/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'su', loadChildren: () => import('./feature/su/su.module').then(m => m.SuModule) },
      { path: 'db', loadChildren: () => import('./feature/db/db.module').then(m => m.DbModule) },
      { path: 'qt', loadChildren: () => import('./feature/qt/qt.module').then(m => m.QtModule) },
      { path: 'po', loadChildren: () => import('./feature/po/po.module').then(m => m.PoModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
