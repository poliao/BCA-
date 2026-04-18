import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Qtmt01Service } from './qtmt01.service';
import { Qtmt01 } from './qtmt01.model';
import { SaveDataService } from '@app/core/services/save-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { PageCriteria } from '@app/shared/components/datatable/page';

@Component({
  templateUrl: './qtmt01.component.html'
})
export class Qtmt01Component implements OnInit, OnDestroy {
  dataSource!: PaginatedDataSource<Qtmt01, any>;
  displayedColumns: string[] = ['quotationNo', 'quotationDate', 'customerName', 'grandTotal', 'profitMarginPercent', 'status'];
  keyword = '';
  initialPageSort = new PageCriteria('quotationNo desc');

  constructor(
    private service: Qtmt01Service,
    private router: Router,
    private route: ActivatedRoute,
    private save: SaveDataService
  ) { }

  ngOnInit(): void {
    this.initialPageSort = this.save.retrive('qtmt01page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('qtmt01') ?? '';

    this.dataSource = new PaginatedDataSource<Qtmt01, any>(
      (request, query) => this.service.getQuotations(request, query),
      this.initialPageSort
    );

    this.dataSource.queryBy({ keyword: this.keyword });
  }

  ngOnDestroy(): void {
    this.save.save(this.keyword, 'qtmt01');
    this.save.save(this.dataSource.getPageInfo(), 'qtmt01page');
  }

  onSearch(value: string) {
    this.keyword = value;
    this.dataSource.queryBy({ keyword: this.keyword }, true);
  }

  add() {
    this.router.navigate(['/qt/qtmt01/detail']);
  }

  edit(row: Qtmt01) {
    this.router.navigate(['/qt/qtmt01/detail'], { state: { id: row.id } });
  }

  search() {
    this.onSearch(this.keyword);
  }
}
