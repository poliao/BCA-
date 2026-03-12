import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatHeaderRowDef, MatRowDef, MatColumnDef, MatTable, MatFooterRowDef } from '@angular/material/table';
import { AfterContentInit, Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { SubscriptionDisposer } from '../subscription-disposer';
import { PaginatedDataSource } from './server-datasource';

@Component({
  selector: 'app-table[server]',
  templateUrl: './table-server.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class TableServerComponent<T> extends SubscriptionDisposer implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
  @ContentChildren(MatFooterRowDef) footerRowDefs!: QueryList<MatFooterRowDef>;

  @ViewChild(MatTable, { static: true }) table!: MatTable<T>;
  @ContentChild(TemplateRef) detailTemplate!: TemplateRef<any>;
  @ContentChild(MatSort) sort!: MatSort;

  @Input() multiTemplateDataRows: boolean = true;
  @Input() columns!: string[];
  @Input() dataSource!: PaginatedDataSource<any, any>;
  @Input() pagination = true;
  @Input() expandRow = false;
  @Input() containerHeight: string | number = 'auto';

  pageSizeOption = [5, ...Array.from(Array(20).keys()).map((v, i) => 10 + i * 10)];
  expandedElement = new Set<any>();
  currentRow?: any;

  ngOnInit(): void {
    if (this.expandRow) {
      this.columns.unshift('expand');
    }
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
        this.dataSource.sortBy(value);
      })
    }
  }

  ngAfterContentInit(): void {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    if (this.rowDefs?.length) {
      this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    }
    this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
    this.footerRowDefs.forEach(footerRowDef => this.table.addFooterRowDef(footerRowDef));
  }

  expandAll(): void {
    if (this.expandRow) {
      this.dataSource.page$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          this.expandedElement.add(data);
        });
    }
  }

  toggle(row: any): void {
    this.expandedElement.has(row) ? this.expandedElement.delete(row) : this.expandedElement.add(row);
  }

  highlight(row: any): void {
    this.currentRow = row;
  }
}
