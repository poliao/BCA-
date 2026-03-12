import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Pattern } from '@app/shared/components/textbox/pattern';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { filter, Observable, of, switchMap, takeUntil, timer } from 'rxjs';
import { Sumt06Service, SuUser, SuUserCompany, SuUserProfile } from './sumt06.service';
import { Sumt06CompanySelectComponet } from './sumt06-company-select.component';


@Component({
  selector: 'app-sumt06-detail',
  templateUrl: './sumt06-detail.component.html'
})
export class Sumt06DetailComponent extends SubscriptionDisposer implements OnInit {
  master = { policy: { passwordAge: 0 }, profiles: [], userTypes: [], profileActives: {}, languages: [], company: [], employee: [], usedEmployee: [] };
  user: SuUser = {} as SuUser;
  userDataSource!: FormDatasource<SuUser>;
  userProfilesDataSources: FormDatasource<SuUserProfile>[] = [];
  userProfiles!: MatTableDataSource<FormDatasource<SuUserProfile>>;
  userCompanyDataSources: FormDatasource<SuUserCompany>[] = [];
  userCompany!: MatTableDataSource<FormDatasource<SuUserCompany>>;

  saving = false;
  actions: any;
  filterEmployee: any;
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    private ms: MessageService,
    private su: Sumt06Service) {
    super();
  }
  ngOnInit(): void {
    this.userProfiles = new MatTableDataSource<FormDatasource<SuUserProfile>>([]);
    this.userCompany = new MatTableDataSource<FormDatasource<SuUserCompany>>([]);
    this.route.data.subscribe((data) => {
      this.actions = data.sumt06.actions;
      this.user = data.sumt06.user;
      Object.assign(this.master, data.sumt06.master);
      this.filterEmployee = data.sumt06.master.employee.filter(employee =>
        employee.value === data.sumt06.user.employeeCode ||
        !data.sumt06.master.usedEmployee.some(usedEmployee => usedEmployee.value === employee.value)
    )});  
    this.rebuildForm();
  }

  private addDays(date: Date, days: number): Date {
    let clone = new Date(date.valueOf())
    clone.setDate(clone.getDate() + days);
    return clone;
  }

  createUserForm(user: SuUser) {
    const fg = this.fb.group({
      userName: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(Pattern.Username)]],
      email: [null, [Validators.required, Validators.maxLength(200), Validators.email]],
      phoneNumber: [null, Validators.pattern(Pattern.Phone)],
      defaultLang: ['TH', Validators.required],
      userType: [null, Validators.required],
      employeeCode: [null, Validators.required],
      forceChangePassword: [true],
      startEffectiveDate: [new Date(), [Validators.required]],
      endEffectiveDate: [null],
      active: [true],
      lockoutEnabled: [{ value: null, disabled: true }]
    })

    if (this.user.employeeCode != null) {
      fg.controls.employeeCode.disable({ emitEvent: false });
    }

    if (this.user.lastChangePassword && this.master.policy.passwordAge) {
      this.user.passwordExpireDate = this.addDays(this.user.lastChangePassword, this.master.policy.passwordAge);
    }
    else this.user.passwordExpireDate = null;

    return fg;
  }

  rebuildForm() {
    this.userDataSource = new FormDatasource<SuUser>(this.user, this.createUserForm(this.user));
    this.userProfilesDataSources = [];
    this.userCompanyDataSources = [];
    if (this.user.rowVersion) {
      this.userDataSource.form.controls.userName.disable();
      (this.user.userProfiles || []).forEach(profile => {
        const profileDataSource = new FormDatasource<SuUserProfile>(profile, this.createUserProfileForm(profile));
        this.userProfilesDataSources.push(profileDataSource);
      });
      (this.user.userCompany || []).forEach(company => {
        const companyDataSource = new FormDatasource<SuUserCompany>(company, this.createUserCompanyForm(company));
        this.userCompanyDataSources.push(companyDataSource);
      });
    }
    this.reload();
  }

  createUserProfileForm(userProfile: SuUserProfile) {
    this.master.profileActives[userProfile.guid] = this.util.getActive(this.master.profiles, userProfile.profileCode);
    const fg = this.fb.group({
      profileCode: [null, Validators.required],
    })
    if (userProfile.rowVersion) {
      fg.controls.profileCode.disable({ emitEvent: false });
    }
    return fg;
  }

  createUserCompanyForm(userComapny: SuUserCompany) {
    const fg = this.fb.group({
      mainCompany: [null],
      companyCode: [null, Validators.required],
      isDefault: false
    })
    if (userComapny.rowVersion) {
      fg.controls.companyCode.disable({ emitEvent: false });
    }
    return fg;
  }

  reload() {
    this.userProfiles.data = this.userProfilesDataSources.filter(o => !o.isDelete);
    this.userCompany.data = this.userCompanyDataSources.filter(o => !o.isDelete);
  }


  add() {
    const profile = new SuUserProfile();
    const userDataSource = new FormDatasource<SuUserProfile>(profile, this.createUserProfileForm(profile));
    this.userProfilesDataSources.push(userDataSource);
    this.reload();
    timer(10).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => this.userProfiles.paginator.lastPage());
    this.userDataSource.form.markAsDirty();
  }

  addComp() {
    this.modal.open(Sumt06CompanySelectComponet, {
      data: {
        items: this.master.company.filter(company =>
          !this.userCompanyDataSources.some(source =>
            !source.isDelete &&
            source.form.get('companyCode')?.value === company.value
          )
        )
      }
    }, Size.Large).subscribe((result) => {
      if (result) {
        result.forEach(company => {
          const newCompany = new SuUserCompany();
          const companyDataSource = new FormDatasource<SuUserCompany>(newCompany, this.createUserCompanyForm(newCompany));
          companyDataSource.form.patchValue({
            companyCode: company.value,
            isDefault: false
          });
          this.userCompanyDataSources.push(companyDataSource);
        });
        this.reload();
        timer(10).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => this.userCompany.paginator?.firstPage());
        this.userDataSource.form.markAsDirty();
      }
    });
  }

  remove(source: FormDatasource<SuUserProfile>) {
    if (source.isAdd) {
      this.userProfilesDataSources = this.userProfilesDataSources.filter(o => o.id !== source.id);
    }
    else source.markForDelete();
    this.reload();
    this.userDataSource.form.markAsDirty();
  }

  removeComp(source: FormDatasource<SuUserCompany>) {
    if (source.isAdd) {
      this.userCompanyDataSources = this.userCompanyDataSources.filter(o => o.id !== source.id);
    }
    else source.markForDelete();
    this.reload();
    this.userDataSource.form.markAsDirty();
  }

  save() {
    let invalid = false;
    this.util.markFormGroupTouched(this.userDataSource.form)
    if (this.userDataSource.form.invalid) {
      this.ms.warning('message.STD00027', ['label.SUMT06.Detail'])
      invalid = true;
    }

    if (this.userProfilesDataSources.some(source => source.form.invalid)) {
      this.userProfilesDataSources.forEach(source => this.util.markFormGroupTouched(source.form));
      this.ms.warning('message.STD00027', ['label.SUMT06.UserProfile'])
      invalid = true;
    }

    // if (this.userProfilesDataSources.length === 0) {
    //   this.ms.warning('label.SUMT06.WarningUserProfile')
    //   invalid = true;
    // }

    // if (this.userCompanyDataSources.filter(o => !o.isDelete).length === 0) {
    //   this.ms.warning('label.SUMT06.WarningPermission')
    //   invalid = true;
    // }

    this.userCompanyDataSources


    const seenLabel = new Set();
    const profileDuplicates = this.userProfilesDataSources.filter(o => !o.isDelete).some(source => {
      return source.form.controls.profileCode.value != null && seenLabel.size === seenLabel.add(source.form.controls.profileCode.value).size;
    });
    seenLabel.clear()
    const companyDuplicates = this.userCompanyDataSources.filter(o => !o.isDelete).some(source => {
      return source.form.controls.companyCode.value != null && seenLabel.size === seenLabel.add(source.form.controls.companyCode.value).size;
    });
    seenLabel.clear()
    const defaultDuplicates = this.userCompanyDataSources.filter(o => !o.isDelete).some(source => {
      return source.form.controls.isDefault.value == true && seenLabel.size === seenLabel.add(source.form.controls.isDefault.value).size;
    });
    seenLabel.clear()
    const minCompany = this.userCompanyDataSources.filter(o => !o.isDelete).some(source => {
      return source.form.controls.isDefault.value == true;
    });

    if (profileDuplicates) {
      this.ms.error('message.STD00004', ['label.SUMT06.ProfileCode']);
      invalid = true;
    } else if (companyDuplicates) {
      this.ms.error('message.STD00004', ['label.SUMT06.Permission']);
      invalid = true;
    } else if (defaultDuplicates) {
      this.ms.error('message.STD00026', ['1', 'label.SUMT06.Default',],);
      invalid = true;
    } else if (!minCompany){
      this.ms.error('message.STD00049');
      invalid = true;
    }

    if (invalid) return;

    const oldForceChangePassword = this.user.forceChangePassword;
    this.userDataSource.updateValue();

    this.userProfilesDataSources.forEach(dataSource => {
      dataSource.updateValue();
    })

    this.userCompanyDataSources.forEach(dataSource => {
      dataSource.updateValue();
    })

    const userProfiles = this.userProfilesDataSources.filter(source => !source.isNormal).map(source => source.model);
    const userCompany = this.userCompanyDataSources.filter(source => !source.isNormal).map(source => source.model);
    this.user.userProfiles = userProfiles;
    this.user.userCompany = userCompany;

    this.su.save(this.user).pipe(
      switchMap(result => {
        this.ms.success('message.STD00006');
        if (result.emailSended === false) {
          this.ms.warning('message.STD00043');
        }
        if (oldForceChangePassword !== this.user.forceChangePassword) {
          return this.su.forceUpdatePassword(this.user.id ?? result.id, this.user.userName, this.user.forceChangePassword).pipe(
            switchMap(() => this.su.getUser(this.user.id ?? result.id))
          )
        }
        else return this.su.getUser(this.user.id ?? result.id)
      })
    ).subscribe(user => {
      this.user = user;
      this.rebuildForm();
    })



  }

  resetPassword() {
    if (!this.user.id || this.isDirty) {
      this.ms.warning('message.STD00028');
      return;
    }
    this.modal.confirm('message.SU00013').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.forceUpdatePassword(this.user.id, this.user.userName, this.user.forceChangePassword)),
      switchMap(emailSended => {
        this.ms.success('message.STD00006');
        return this.su.getUser(this.user.id)
      })
    ).subscribe(user => {
      this.user = user;
      this.rebuildForm();
    })
  }

  forgetPassword() {
    if (!this.user.id || this.isDirty) {
      this.ms.warning('message.STD00028');
      return;
    }
    this.su.forgetPassword(this.user.userName).subscribe(() => this.ms.success('message.STD00041'));
  }

  private get isDirty() {
    return this.userDataSource.form.dirty || this.userProfilesDataSources.some(source => source.form.dirty);
  }

  canDeactivate(): Observable<boolean> {
    if (this.isDirty) {
      return this.modal.confirm("message.STD00002");
    }
    return of(true);
  }

  forceUpdatePassword(){
    this.su.forceUpdatePassword(this.user.id, this.user.userName, this.user.forceChangePassword).pipe(
      switchMap(() => this.su.getUser(this.user.id))
    )
  }

  ublockBruteForceUser(){
    this.su.ublockBruteForceUser(this.user.userName).subscribe({
      next: () => {
        this.ms.success('message.STD00006');
      },
      error: err => {
        this.ms.error('message.STD00006');
      }
    });
  }
}
