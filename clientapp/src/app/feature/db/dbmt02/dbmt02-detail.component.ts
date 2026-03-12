import { Component, OnInit } from '@angular/core';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Dbposition } from './dbmt02.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Dbmt02Service } from './dbmt02.service';
import { MessageService } from '@app/core/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';

@Component({
  templateUrl: './dbmt02-detail.component.html'
})
export class Dbmt02DetailComponent implements OnInit {
  saving = false;
  posiationDataSource!: FormDatasource<Dbposition>;
  posiation: Dbposition = {} as Dbposition;
  master: any = {};

  actions: any;
  constructor(
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly db: Dbmt02Service,
    private readonly ms: MessageService,
    private readonly route: ActivatedRoute,
  ) {
  }
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.posiation = data.dbmt02.detail;
      this.actions = data.dbmt02.actions;
      Object.assign(this.master, data.dbmt02.master);
      this.rebuildForm();
    });
  }
  save() {
    let invalid = false;

    this.util.markFormGroupTouched(this.posiationDataSource.form);
    if (this.posiationDataSource.form.invalid) invalid = true;

    if (invalid) return;
    this.posiationDataSource.updateValue();

    const formData = {
      ...this.posiationDataSource.model
    };
    this.db.save(formData).pipe(
      switchMap(() => this.db.getPosiationDetail(this.posiationDataSource.form.controls.positionCode.value))
    ).subscribe(response => {
      this.posiation = response;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });

  }

  createMainForm() {
    const fg = this.fb.group({
      positionCode: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
      positionNameTha: [null, [Validators.required, Validators.maxLength(100), Validators.pattern('^[ก-๙\\s]+$')]],
      positionNameEng: [null, [Validators.maxLength(100), Validators.pattern('^[a-zA-Z\\s]+$')]],
      priorityApprovalLevel: [null, [Validators.required, Validators.maxLength(4), Validators.min(0), Validators.max(999)]],
      active: [true]
    })
    if (this.posiation.rowVersion) {
      fg.controls.positionCode.disable({ emitEvent: false });
    }
    return fg
  }
  rebuildForm() {
    this.posiationDataSource = new FormDatasource<Dbposition>(this.posiation, this.createMainForm());
  }
}
