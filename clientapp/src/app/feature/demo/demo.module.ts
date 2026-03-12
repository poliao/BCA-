import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { Surt04Service } from '../su/surt04/surt04.service';
import { DemoRoutingModule } from './demo-routing.module';
import { InputComponent } from './input/input.component';
import { InputService } from './input/input.service';
import { MultipleFileModalComponent } from './input/multiple-file-modal/multiple-file-modal.component';
import { SingleLookupComponent } from './input/single-lookup/single-lookup.component';
import { DialogExampleComponent } from './layout/dialog-example/dialog-example.component';
import { LayoutComponent } from './layout/layout.component';
import { TableAdvanceComponent } from './table/table-advance/table-advance.component';
import { MultipleSelectComponent } from './table/table-multiple-select/multiple-select/multiple-select.component';
import { MultipleSelectService } from './table/table-multiple-select/multiple-select/multiple-select.service';
import { TableMultipleSelectComponent } from './table/table-multiple-select/table-multiple-select.component';
import { TableServerComponent } from './table/table-server/table-server.component';
import { TableComponent } from './table/table.component';


@NgModule({
  declarations: [
    LayoutComponent,
    InputComponent,
    SingleLookupComponent,
    MultipleFileModalComponent,
    DialogExampleComponent,
    TableComponent,
    TableServerComponent,
    TableMultipleSelectComponent,
    TableAdvanceComponent,
    MultipleSelectComponent
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
    SharedModule
  ],
  providers: [InputService, MultipleSelectService , Surt04Service]
})
export class DemoModule { }
