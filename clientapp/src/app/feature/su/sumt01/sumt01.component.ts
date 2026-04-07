import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Sumt01Service } from './sumt01.service';
import { SuMenu } from './sumt01.model';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { SaveDataService } from '@app/core/services/save-data.service';

@Component({
  selector: 'app-sumt01',
  templateUrl: './sumt01.component.html'
})
export class Sumt01Component implements OnInit {

  displayedColumns: string[] = ['menuCode', 'menuNameEn', 'menuNameTh', 'url', 'sequence', 'action'];
  dataSource!: PaginatedDataSource<SuMenu, any>;
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
    this.dataSource = new PaginatedDataSource<SuMenu, any>(
      (request, query) => this.su.getMenus(Object.assign(query, request)),
      new PageCriteria('sequence')
    );
    this.dataSource.queryBy({});
  }

  loadData() {
    this.dataSource.queryBy({});
  }

  add() {
    this.router.navigate(['/su/sumt01/detail']);
  }

  remove(row: SuMenu) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.delete(row.id))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.dataSource.calculatePageAfterDelete();
      this.dataSource.fetch(page);
    })
  }
}
