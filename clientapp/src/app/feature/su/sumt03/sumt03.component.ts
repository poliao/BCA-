import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Sumt03Service } from './sumt03.service';

@Component({
  selector: 'app-sumt03',
  templateUrl: './sumt03.component.html'
})
export class Sumt03Component implements OnInit {

  displayedColumns: string[] = ['processName', 'groupName', 'locationName', 'baseUom', 'status', 'action'];
  displayedColumnsNodelete: string[] = ['processName', 'groupName', 'locationName', 'baseUom', 'status'];
  keyword = '';
  initialPageSort = new PageCriteria('processName');
  data!: PaginatedDataSource<any, any>;
  actions: any = {};
  constructor(
    private router: Router,
    private su: Sumt03Service,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.sumt03.actions;
    });
    this.initialPageSort = this.save.retrive('sumt03page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('sumt03') ?? '';
    this.data = new PaginatedDataSource<any, any>((request, query) => this.su.getProcesses(request, query), this.initialPageSort)

    this.data.queryBy({ keyword: this.keyword });
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'sumt03');
    this.save.save(this.data.getPageInfo(), 'sumt03page');
  }

  onSearch(value: string) {
    this.keyword = value;
    this.data.queryBy({ keyword: this.keyword }, true);
  }

  add() {
    this.router.navigate(['/su/sumt03/detail']);
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.delete(row.id))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }
}
