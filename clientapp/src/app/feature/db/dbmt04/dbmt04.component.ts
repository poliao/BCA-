import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbmt04Service } from './dbmt04.service';
import { FormGroup } from '@angular/forms';

@Component({
  templateUrl: './dbmt04.component.html'
})

export class Dbmt04Component implements OnInit {


  displayedColumns: string[] = ['BankCode', 'BankNameTha', 'BankNameEng', 'Active', 'Delete'];
  displayedColumnsNodelete: string[] = ['BankCode', 'BankNameTha', 'BankNameEng', 'Active'];
  keyword = '';
  initialPageSorts = new PageCriteria('BankCode,BankNameTha,BankNameEng');
  searchForm!: FormGroup;
  data!: PaginatedDataSource<any, any>;
  actions: any;
  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private db: Dbmt04Service,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.dbmt04.actions;
    });
    this.initialPageSorts = this.save.retrive('dbmt04page') ?? this.initialPageSorts;
    this.keyword = this.save.retrive('dbmt04') ?? '';
    this.data = new PaginatedDataSource<any, any>((request, query) => this.db.getBank(request, query),this.initialPageSorts)
    this.data.queryBy({ keyword: this.keyword });
    this.db.getBank(this.initialPageSorts,0).subscribe((data) => console.log(data));
  }

  onSearch(value: string) {
    this.keyword = value;
    this.data.queryBy({ keyword: this.keyword }, true);
  }

  add() {
    this.router.navigate(['/db/dbmt04/detail']);
  }
  
  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.db.deleteBank(row.bankCode, row.rowVersion))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }
}
