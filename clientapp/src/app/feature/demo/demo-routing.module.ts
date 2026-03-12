import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InputComponent } from './input/input.component';
import { LayoutComponent } from './layout/layout.component';
import { TableAdvanceComponent } from './table/table-advance/table-advance.component';
import { TableMultipleSelectComponent } from './table/table-multiple-select/table-multiple-select.component';
import { TableServerComponent } from './table/table-server/table-server.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'layout', component: LayoutComponent },
      { path: 'input', component: InputComponent },
      { path: 'datatable', component: TableComponent },
      { path: 'datatable-advance', component: TableAdvanceComponent },
      { path: 'datatable-server', component: TableServerComponent },
      { path: 'datatable-multi', component: TableMultipleSelectComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
