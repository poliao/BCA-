import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header/header.component';
import { ShellComponent } from './shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { LocalizedDatePipe } from '@app/shared/pipe/date.pipe';


@NgModule({
  declarations: [
    ShellComponent,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LayoutModule,
    MatMenuModule,
    NgScrollbarModule,
    LocalizedDatePipe
  ]
})
export class ShellModule { }
