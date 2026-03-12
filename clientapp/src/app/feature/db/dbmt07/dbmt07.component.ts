import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbmt07Service } from './dbmt07.service';

@Component({
  templateUrl: './dbmt07.component.html'
})

export class Dbmt07Component implements OnInit {
  displayedColumns: string[] = ['CountryCode', 'CountryNameTha', 'CountryNameEng', 'Active', 'Delete'];
  displayedColumnsNoDelete: string[] = ['CountryCode', 'CountryNameTha', 'CountryNameEng', 'Active'];
  keyword = '';
  initialPageSorts = new PageCriteria('CountryCode,CountryNameTha');
  data!: PaginatedDataSource<any, any>;
  actions: any;

  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private db: Dbmt07Service,
    private ms: MessageService,
    private save: SaveDataService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.dbmt07.actions;
    });
    this.initialPageSorts = this.save.retrive('dbmt07page') ?? this.initialPageSorts;
    this.keyword = this.save.retrive('dbmt07') ?? '';
    this.data = new PaginatedDataSource<any, any>((request, query) => this.db.getCountryList(request, query),this.initialPageSorts)
    this.data.queryBy({ keyword: this.keyword });
  }

  onSearch(value: string) {
    this.keyword = value;
    this.data.queryBy({ keyword: this.keyword }, true);
  }

  add() {
    this.router.navigate(['/db/dbmt07/detail']);
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.db.delete(row.countryCode))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }
}
