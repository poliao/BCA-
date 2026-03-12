import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Sumt06Service } from './sumt06.service';

@Component({
  selector: 'app-sumt06',
  templateUrl: './sumt06.component.html'
})
export class Sumt06Component implements OnInit {
  master = { statuses: [], profiles: [], userTypes: [] };
  displayedColumns: string[] = ['userName', 'name', 'email', 'phoneNumber', 'userType', 'active', 'forceChangePassword', 'action'];
  displayedColumnsNodelete: string[] = ['userName', 'name', 'email', 'phoneNumber', 'userType', 'active', 'forceChangePassword'];
  searchForm!: FormGroup;
  initialPageSort = new PageCriteria('userName');
  data!: PaginatedDataSource<any, any>;
  actions: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private su: Sumt06Service,
    private modal: ModalService,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.master = data.sumt06.master;
      this.actions = data.sumt06.actions;
    });
    this.createSearchForm();
    this.initialPageSort = this.save.retrive('sumt06page') ?? this.initialPageSort;
    const values = this.save.retrive('sumt06');
    if (values) {
      this.searchForm.patchValue(values);
    }
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.su.getUsers(request, query),
      this.initialPageSort)

    this.data.queryBy(this.searchForm.value);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      username: null,
      name: null,
      email: null,
      phoneNumber: null,
      userType: null,
      status: null,
      profileCode: null
    })
  }

  ngOnDestroy() {
    this.save.save(this.searchForm.value, 'sumt06');
    this.save.save(this.data.getPageInfo(), 'sumt06page');
  }

  search() {
    this.data.queryBy(this.searchForm.value, true);
  }

  reset() {
    this.searchForm.reset();
  }

  add() {
    this.router.navigate(['/su/sumt06/detail']);
  }


  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.delete(row.userId, row.rowVersion))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }
}
