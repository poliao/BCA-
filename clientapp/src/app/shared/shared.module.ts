import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule, MAT_TABS_CONFIG } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatRadioModule } from '@angular/material/radio';

import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

import { ContentUploadService } from './components/attachment/content-upload.service';
import { COMPONENTS } from './components/components';
import { PaginatorIntl } from './components/datatable/paginator-intl';
import { APP_DATE_FORMATS, AppDateAdapter } from './components/datepicker/date.adaptor';
import { ModalService } from './components/modal/modal.service';
import { TooltipModule } from './components/tooltip/tooltip.module';
import { LocalizedDatePipe } from './pipe/date.pipe';

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    NgOptionHighlightModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSortModule,
    MatRadioModule,
    TooltipModule,
    LocalizedDatePipe
  ],
  exports: [
    ...COMPONENTS,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    NgOptionHighlightModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatDialogModule,
    MatTabsModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSortModule,
    MatRadioModule,
    TooltipModule,
    LocalizedDatePipe
  ],
  providers: [
    ModalService,
    ContentUploadService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'custom',
      },
    },
    {
      provide: MAT_TABS_CONFIG,
      useValue: {
        animationDuration: '0ms',
        dynamicHeight: true,
        preserveContent: true,
        stretchTabs: false,

      },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: 'custom',
      },
    },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: 'dd/MM/yyyy' } },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MatPaginatorIntl, useClass: PaginatorIntl }
  ]
})
export class SharedModule { }
