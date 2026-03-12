import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatHeaderRowDef, MatRowDef, MatColumnDef, MatTable, MatTableDataSource, MatFooterRowDef } from '@angular/material/table';
import { AfterContentInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, Input, Output, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-table:not([server])',
  templateUrl: './table.component.html',
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
export class TableComponent<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
  @ContentChildren(MatFooterRowDef) footerRowDefs!: QueryList<MatFooterRowDef>;

  @ViewChild(MatTable, { static: true }) table!: MatTable<T>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ContentChild(MatSort) sort!: MatSort;
  @ContentChild(TemplateRef) detailTemplate!: TemplateRef<any>;

  @Input() multiTemplateDataRows: boolean = true;
  @Input() columns: string[] = [];
  @Input() dataSource!: MatTableDataSource<T>;
  @Input() pagination = true;
  @Input() defaultPageSize = 5;
  @Input() expandRow = false;
  @Input() containerHeight: string | number = 'auto';

  @Output() rowClick = new EventEmitter<any>();

  pageSizeOption = [5, ...Array.from(Array(20).keys()).map((v, i) => 10 + i * 10)];
  expandedElement = new Set<any>();
  currentRow?: any;

  private previousMatColumnDef!: MatColumnDef[];

  ngOnInit(): void {
    if (this.expandRow && !this.columns.includes('expand')) {
      this.columns.unshift('expand');
    }
  }

  // constructor(@Optional() @Self() public matSort: MatSort){ //next project can set on component
  //   console.log(matSort)
  // }
  constructor(private readonly dtr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      if (this.pagination) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  getPropertyByPath(obj: Object, pathString: string): any {
    return pathString.split('.').reduce((o, i) => o[i], obj);
  }

  ngAfterViewInit(): void {
    if (this.pagination) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterContentInit(): void {
    this.columnDefs.changes.subscribe(c => {
      if (this.previousMatColumnDef.length) {
        this.previousMatColumnDef.forEach(columnDef => this.table.removeColumnDef(columnDef));
      }
      this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
      this.previousMatColumnDef = [...this.columnDefs];
    })

    if (this.sort) {
      this.dataSource.sortingDataAccessor = (data, sortHeaderId: string) => {
        return this.getPropertyByPath(data, sortHeaderId);
      }
      this.dataSource.sort = this.sort;
    }
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.previousMatColumnDef = [...this.columnDefs];

    if (this.rowDefs?.length) {
      this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    }
    this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
    this.footerRowDefs.forEach(footerRowDef => this.table.addFooterRowDef(footerRowDef));

  }

  expandAll(): void {
    if (this.expandRow) {
      this.dataSource.data.forEach(item => {
        this.expandedElement.add(item);
      })
      this.dtr.detectChanges();
    }
  }

  toggle(row: any): void {
    this.expandedElement.has(row) ? this.expandedElement.delete(row) : this.expandedElement.add(row)
  }

  highlight(row: any): void {
    this.currentRow = row;
    this.emitRowClick(row);
  }

  emitRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  goLastPage(): void {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.lastPage();
    }
  }

  goPage(pageNo: number): void {
    this.paginator.pageIndex = pageNo;
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
