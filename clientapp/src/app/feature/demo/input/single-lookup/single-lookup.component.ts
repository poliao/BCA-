import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { InputService } from '../input.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';

@Component({
  selector: 'app-single-lookup',
  templateUrl: './single-lookup.component.html'
})
export class SingleLookupComponent implements OnInit {
  displayedColumns: string[] = ['action', 'value', 'text', 'programPath'];
  initialPageSort = new PageCriteria('value,text');
  items!: PaginatedDataSource<any, any>;

  constructor(
    private readonly is: InputService,
    public dialogRef: MatDialogRef<SingleLookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { keyword: string }) { }

  ngOnInit(): void {
    this.items = new PaginatedDataSource<any, any>(
      (request, query) => this.is.getLookupPage(request, query),
      this.initialPageSort)
    this.items.queryBy({ keyword: this.data.keyword });
  }

  onSearch(value: string): void {
    this.items.queryBy({ keyword: value });
  }

  select(row: any): void {
    this.dialogRef.close(row);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
