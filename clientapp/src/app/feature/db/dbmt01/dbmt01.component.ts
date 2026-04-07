import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbmt01Service } from './dbmt01.service';
import { DbLanguage } from './dbmt01.model';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { PageCriteria } from '@app/shared/components/datatable/page';

@Component({
  selector: 'app-dbmt01',
  templateUrl: './dbmt01.component.html'
})
export class Dbmt01Component implements OnInit {
  displayedColumns: string[] = ['languageCode', 'languageName', 'isActive', 'action'];
  dataSource!: PaginatedDataSource<DbLanguage, any>;
  actions: any;

  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private db: Dbmt01Service,
    private ms: MessageService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.dbmt01.actions;
    });
    this.dataSource = new PaginatedDataSource<DbLanguage, any>(
      (request, query) => this.db.getLanguages(Object.assign(query, request)),
      new PageCriteria('languageCode')
    );
    this.dataSource.queryBy({});
  }

  loadData() {
    this.dataSource.queryBy({});
  }

  add() {
    this.router.navigate(['/db/dbmt01/detail']);
  }

  remove(row: DbLanguage) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.db.delete(row.id))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.dataSource.calculatePageAfterDelete();
      this.dataSource.fetch(page);
    })
  }

  edit(row: DbLanguage) {
    this.router.navigate(['/db/dbmt01/detail'], { state: { language: row } });
  }
}
