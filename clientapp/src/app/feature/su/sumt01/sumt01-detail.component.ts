import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Pattern } from '@app/shared/components/textbox/pattern';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, of, switchMap, takeUntil, timer } from 'rxjs';
import { SuSystem } from './sumt01.model';
import { Sumt01Service } from './sumt01.service';

@Component({
  selector: 'app-sumt01-detail',
  templateUrl: './sumt01-detail.component.html'
})
export class Sumt01DetailComponent extends SubscriptionDisposer implements OnInit {
  master = { systemCodes: [], moduleCodes: [], langCodes: [] as any[], langCodesTo: [] as any[], programTypes: [] };
  program: SuSystem = {  } as SuSystem;

  langs!: MatTableDataSource<any>;

  programDataSource!: FormDatasource<SuSystem>;
  currentLanguage!: { text: string, value: string };
  actions: any;

  saving = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly modal: ModalService,
    public dialog: MatDialog,
    private readonly ms: MessageService,
    private readonly su: Sumt01Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.program = data.sumt01.detail;
      this.actions = data.sumt01.actions;
      Object.assign(this.master, data.sumt01.master);
      this.langs = new MatTableDataSource<any>(this.master.langCodes);
      this.rebuildForm();
    });
  }

  createProgramForm() {
    const fg = this.fb.group({
      systemCode: [null, [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
      systemNameTH: [null, [Validators.required, Validators.maxLength(100)]],
      systemNameENG: [null, [Validators.required,Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      systemUrl: [null],
      systemImage: [null],
      systemDescription: [null],
      active: [true]
    })
    if (this.program.rowVersion) {
      fg.controls.systemCode.disable({ emitEvent: false });
    }
    return fg;
  }

  rebuildForm() {
    this.programDataSource = new FormDatasource<SuSystem>(this.program, this.createProgramForm());
    this.changeLanguage(this.currentLanguage ?? this.master.langCodes[0]);
  }

  changeLanguage(lang: any) {
    this.currentLanguage = lang;
  }
  
  save() {
    let invalid = false;
    this.util.markFormGroupTouched(this.programDataSource.form);
    if (this.programDataSource.form.invalid) invalid = true;
    if (invalid) return;
    this.programDataSource.updateValue();
    this.su.save(this.program).pipe(
      switchMap(() => this.su.getSystem(this.program.systemCode))
    ).subscribe(program => {
      this.program = program;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    })
  }

  canDeactivate(): Observable<boolean> {
    if (this.programDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return of(true);
  }

}
