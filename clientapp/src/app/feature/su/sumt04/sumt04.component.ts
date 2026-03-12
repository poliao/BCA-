import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { Pattern } from '@app/shared/components/textbox/pattern';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { filter, switchMap } from 'rxjs';
import { Sumt04Service } from './sumt04.service';

@Component({
  selector: 'app-sumt04',
  templateUrl: './sumt04.component.html'
})
export class Sumt04Component implements OnInit {
  displayedColumns: string[] = ['profileCode','systemCode', 'profileName', 'description', 'active', 'copy', 'action'];
  displayedColumnsNodelete: string[] = ['profileCode','systemCode', 'profileName', 'description', 'active', 'copy'];
  displayedColumnsNocopy: string[] = ['profileCode','systemCode', 'profileName', 'description', 'active', 'action'];
  displayedColumnsNoaction: string[] = ['profileCode','systemCode', 'profileName', 'description', 'active'];
  keyword = '';
  initialPageSort = new PageCriteria('profileCode,profileName,description');
  actions: any
  data!: PaginatedDataSource<any, any>;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private util: FormUtilService,
    private modal: ModalService,
    private su: Sumt04Service,
    private readonly route: ActivatedRoute,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.sumt04.actions;
    });
    this.initialPageSort = this.save.retrive('sumt04page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('sumt04') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.su.getProfiles(request, query),
      this.initialPageSort)

    this.data.queryBy({ keyword: this.keyword });
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'sumt04');
    this.save.save(this.data.getPageInfo(), 'sumt04page');
  }

  onSearch(value: string) {
    this.keyword = value;
    this.data.queryBy({ keyword: this.keyword }, true);
  }

  add() {
    this.router.navigate(['/su/sumt04/detail']);
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.delete(row.profileCode, row.rowVersion))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }

  copyForm!: FormGroup;
  copyDialog: MatDialogRef<any>;
  openCopy(row, content) {
    this.copyForm = this.fb.group({
      profileCodeFrom: { value: row.profileCode, disabled: true },
      profileDescFrom: { value: row.description, disabled: true },
      profileCodeTo: [null, [Validators.required, Validators.maxLength(20), Validators.pattern(Pattern.Code)]],
      profileDescTo: [null, [Validators.required, Validators.maxLength(200)]]
    })
    this.copyDialog = this.modal.openTemplate(content, {}, Size.Large)
  }

  copy() {
    this.util.markFormGroupTouched(this.copyForm);
    if (this.copyForm.invalid) return;

    if (this.copyForm.controls.profileCodeFrom.value === this.copyForm.controls.profileCodeTo.value) {
      this.ms.warning("message.STD00009", ['label.SUMT04.CopyFrom', 'label.SUMT04.CopyTo']);
      return;
    }

    this.su.copy(Object.assign({},
      this.copyForm.value,
      {
        profileCodeFrom: this.copyForm.controls.profileCodeFrom.value,
        profileDescFrom: this.copyForm.controls.profileDescFrom.value
      })).subscribe(() => {
        this.ms.success("message.STD00020");
        this.close();
        this.data.queryBy({ keyword: this.keyword });
      });
  }

  close() {
    this.copyDialog.close();
  }
}
