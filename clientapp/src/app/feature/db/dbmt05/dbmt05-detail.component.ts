import { Component, OnInit } from '@angular/core';
import { FormDatasource, EntityBase } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { FormBuilder, MaxValidator, Validators } from '@angular/forms';
import { Dbmt05Service } from './dbmt05.service';
import { MessageService } from '@app/core/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { DbBankAccountType } from './dbmt05.model';


@Component({
  templateUrl: './dbmt05-detail.component.html',
})
export class Dbmt05DetailComponent implements OnInit {
  program: DbBankAccountType = {} as DbBankAccountType;
  saving = false;
  programDataSource!: FormDatasource<DbBankAccountType>;
  actions: any;

  constructor(
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly db: Dbmt05Service,
    private readonly ms: MessageService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.program = data.dbmt05.detail;
      this.actions = data.dbmt05.actions;
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
        this.ms.success('message.STD00006');
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
      bankAccountTypeCode: [null, [Validators.required, Validators.maxLength(2)]],
      bankAccountTypeDescription: [null],
      active: [true],
    });
  }

  rebuildForm() {
    this.programDataSource = new FormDatasource<DbBankAccountType>(this.program, this.createProgramForm());
    if(this.programDataSource.form.controls.bankAccountTypeCode.value) {
      this.programDataSource.form.controls.bankAccountTypeCode.disable();
    }
  }
}
