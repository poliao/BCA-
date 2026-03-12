import { Component, OnInit } from '@angular/core';
import { FormDatasource, EntityBase } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Dbmt06Service } from './dbmt06.service';
import { MessageService } from '@app/core/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { DbPrefix } from './dbmt06.model';

@Component({
  templateUrl: './dbmt06-detail.component.html',
})
export class Dbmt06DetailComponent implements OnInit {
  program: DbPrefix = {} as DbPrefix;
  saving = false;
  master: any;
  programDataSource!: FormDatasource<DbPrefix>;
  actions: any;

  constructor(
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly db: Dbmt06Service,
    private readonly ms: MessageService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.program = data.dbmt06.detail;
      this.master = data.dbmt06.master;
      this.actions = data.dbmt06.actions;
      this.rebuildForm();
    });
  }

  save() {
    let invalid = false;

    this.util.markFormGroupTouched(this.programDataSource.form);
    if (this.programDataSource.form.invalid) invalid = true;

    if (invalid) return;

    this.programDataSource.updateValue();

    const formData = {
      ...this.programDataSource.model,
    };

    this.saving = true;
    this.db.save(formData).subscribe({
      next: (response: any) => {
        this.saving = false;
        this.ms.success('Save completed successfully');
        this.program = response;
        this.rebuildForm();
      },
      error: (error) => {
        this.saving = false;
        this.ms.error('Error occurred while saving data');
      },
    });
  }

  createProgramForm() {
    return this.fb.group({
      prefixNameTha: [null, [Validators.required]],
      prefixNameEng: [null],
      suffixNameTha: [null],
      suffixNameEng: [null],
      personalityType: [null, [Validators.required]],
      active: [true],
      rowVersion: [null],
    });
  }

  rebuildForm() {
    this.programDataSource = new FormDatasource<DbPrefix>(this.program, this.createProgramForm());
  }
}
