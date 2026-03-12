import { Component, OnInit } from '@angular/core';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '@app/core/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Bank, BankBranch } from './dbmt04.model';
import { Dbmt04Service } from './dbmt04.service';
import { RowState } from '@app/shared/constants';



@Component({
  templateUrl: './dbmt04-detail.component.html'
})

export class Dbmt04DetailComponent implements OnInit {
  deletedItems: FormDatasource<BankBranch>[] = [];
  program: Bank = {} as Bank;
  saving = false;
  programDataSource!: FormDatasource<Bank>;
  master: any = {};
  positionCompany: FormDatasource<BankBranch>[] = [];
  BankBranch!: MatTableDataSource<FormDatasource<BankBranch>>;
  actions: any;

  constructor(
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly db: Dbmt04Service,
    private readonly ms: MessageService,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
  this.route.data.subscribe((data) => {
    this.actions = data.dbmt04.actions;
    this.program = data.dbmt04.detail.bank || {} as Bank; // กำหนดข้อมูลธนาคาร
    const bankBranches = data.dbmt04.detail.bankBranches || []; // กำหนดข้อมูลสาขาธนาคาร
    this.positionCompany = bankBranches.map((item: BankBranch) => {
      return new FormDatasource<BankBranch>(item, this.createUserProfileForm(item));
    });
  });

  // สร้าง MatTableDataSource
  this.BankBranch = new MatTableDataSource<FormDatasource<BankBranch>>([]);
  this.rebuildForm(); // สร้างฟอร์มและแพทช์ข้อมูล
}

save(): void {
  if (this.programDataSource.form.invalid || this.positionCompany.some(source => source.form.invalid)) {
    this.util.markFormGroupTouched(this.programDataSource.form);
    this.util.markFormGroupTouched(this.positionCompany.find(source => source.form.invalid)?.form);
    this.ms.error('message.STD00048');
    return;
  }
  const programData = this.programDataSource.form.getRawValue();
  const branchData = this.positionCompany.map((source) => source.form.getRawValue());

  if(branchData.length === 0) {
    this.ms.warning('สาขาต้องมีอย่างน้อย 1 สาขา');
    return;
  }

  if (!programData.bankcode || !programData.banknametha) {
    this.ms.error('Bank Code and Bank Name (Thai) cannot be null.');
    return;
  }
  const hasNullBranch = branchData.some(branch =>
    !branch.branchcode || !branch.branchnametha
  );
  if (hasNullBranch) {
    this.ms.error('Branch Code and Branch Name (Thai) cannot be null.');
    return;
  }
  const branchCodes = branchData.map(branch => branch.branchcode);
  const branchNames = branchData.map(branch => branch.branchnametha);
  const hasDuplicateBranchCode = new Set(branchCodes).size !== branchCodes.length;
  const hasDuplicateBranchName = new Set(branchNames).size !== branchNames.length;

  if (hasDuplicateBranchCode || hasDuplicateBranchName) {
    this.ms.error('Branch Code and Branch Name (Thai) must be unique.');
    return;
  }
  const payload = {
    ...programData,
    BankBranch: branchData,
  };

  this.saving = true;

  this.db.saveBank(payload).subscribe({
    next: () => {
      if (payload.bankcode) {
        this.db.getBankDetail(payload.bankcode).subscribe({
          next: (res) => {
            this.program = res.bank || {} as Bank;
            const bankBranches = res.bankBranches || [];
            this.positionCompany = bankBranches.map((item: BankBranch) => {
              return new FormDatasource<BankBranch>(
                item,
                this.createUserProfileForm(item)
              );
            });

            this.rebuildForm();
            this.saving = false;
            this.ms.success('message.STD00006');
          },
          error: (err) => {
            this.saving = false;
            this.ms.error('Failed to fetch the latest data.');
          },
        });
      }
    },
    error: (err) => {
      this.saving = false;
      this.ms.error('Error occurred during save.');
    },
  });
}

  createProgramForm() {
    const formGroup = this.fb.group({
      bankcode: [this.program.bankcode || null, [Validators.required, Validators.maxLength(5)]],
      banknametha: [this.program.banknametha || null, [Validators.required, Validators.maxLength(100)]],
      banknameeng: [this.program.banknameeng || null],
      active: [this.program.active ?? true],
      transferbankcode: [this.program.transferbankcode || null],
      rowversion: [this.program.rowversion || null],
    });
    if (this.program.rowversion) {
      formGroup.controls.bankcode.disable();
    }
    return formGroup;
  }

  rebuildForm() {
    this.programDataSource = new FormDatasource<Bank>(this.program, this.createProgramForm());
    this.programDataSource.form.patchValue(this.program); // แพทช์ข้อมูลจาก `program.bank`
    this.reload(); // โหลดตาราง BankBranchs
  }

  add() {
    const newBranch = new BankBranch();
    const newBranchForm = this.createUserProfileForm(newBranch);
    this.positionCompany.push(new FormDatasource<BankBranch>(newBranch, newBranchForm));
    this.reload(); // อัปเดตตาราง
  }

  createUserProfileForm(userProfile: BankBranch) {
    const bankcode = this.programDataSource?.form.get('bankcode')?.value;
    const formGroup = this.fb.group({
      bankcode: [bankcode],
      branchcode: [userProfile.branchcode || null, [Validators.required, Validators.maxLength(5)]],
      branchnametha: [userProfile.branchnametha || null, [Validators.required, Validators.maxLength(100)]],
      branchnameeng: [userProfile.branchnameeng || null],
      active: [userProfile.active || true],
      rowversion: [userProfile.rowversion || null],
      RowState: [RowState.Add],
    });
    // แพตช์ข้อมูลลงฟอร์ม
    if (userProfile.rowversion) {
      formGroup.controls.branchcode.disable();
      formGroup.controls.RowState.setValue(RowState.Normal, { emitEvent: false });
    }

    return formGroup;
  }

  reload() {
    this.BankBranch.data = this.positionCompany.filter((item) => !item.isDelete);
  }

  remove(source: FormDatasource<BankBranch>): void {
    this.positionCompany = this.positionCompany.filter((o) => o.id !== source.id);
    this.reload();
  }
}
