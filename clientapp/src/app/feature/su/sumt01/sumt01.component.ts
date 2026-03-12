import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Sumt01Service } from './sumt01.service';


@Component({
  selector: 'app-sumt01',
  templateUrl: './sumt01.component.html'
})
export class Sumt01Component implements OnInit {

  displayedColumns: string[] = ['systemCode', 'systemNameTH', 'systemNameEN', 'active', 'action'];
  displayedColumnsNodelete: string[] = ['systemCode', 'systemNameTH', 'systemNameEN', 'active'];
  keyword = '';
  initialPageSort = new PageCriteria('systemCode,systemNameTH,systemNameEN');
  data!: PaginatedDataSource<any, any>;
  actions: any;
  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private modal: ModalService,
    private su: Sumt01Service,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.sumt01.actions;
     
      
    });
    this.initialPageSort = this.save.retrive('sumt01page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('sumt01') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.su.getSystems(request, query),
      this.initialPageSort)
    this.data.queryBy({ keyword: this.keyword });
      
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'sumt01');
    this.save.save(this.data.getPageInfo(), 'sumt01page');
  }

  onSearch(value: string) {
    this.keyword = value;
    this.data.queryBy({ keyword: this.keyword }, true);
  }


  add() {
    this.router.navigate(['/su/sumt01/detail']);
  }


  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.delete(row.systemCode, row.rowVersion))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }
}
