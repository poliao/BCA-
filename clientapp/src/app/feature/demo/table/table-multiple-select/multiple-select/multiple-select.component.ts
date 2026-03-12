import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomSelectionModal } from '@app/shared/components/datatable/custom-selection-model';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { MultipleSelectService } from './multiple-select.service';



@Component({
  selector: 'app-multiple-select',
  templateUrl: './multiple-select.component.html'
})
export class MultipleSelectComponent implements OnInit {
  displayedSelectColumns: string[] = ['select', 'value', 'text'];

  initialPageSort = new PageCriteria('value,text');
  dataSource!: PaginatedDataSource<any, any>;
  compareFunc = (data, select) => data.value === select.value
  selection = new CustomSelectionModal<any>(true, [], null, this.compareFunc);

  constructor(
    private readonly ts: MultipleSelectService,
    private readonly dialog: MatDialogRef<MultipleSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) { }

  ngOnInit(): void {
    this.dataSource = new PaginatedDataSource<any, any>(
      (request, query) => this.ts.getLookupPage(request, query),
      this.initialPageSort)

    this.dataSource.queryBy({});
  }

  isDisableHeader(rows: any[]): boolean {
    return rows.some(r => r.disabled);
  }

  select(): void {
    this.dialog.close(this.selection.selected)
  }

  close(): void {
    this.dialog.close(false);
  }
}