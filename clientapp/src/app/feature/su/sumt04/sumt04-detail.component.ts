import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, filter } from 'rxjs';

import { MessageService } from '@app/core/services/message.service';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Pattern } from '@app/shared/components/textbox/pattern';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Sumt04MenuComponent } from './sumt04-menu/sumt04-menu.component';
import { Authorize, SuProfile, SuProfileLang, SuProfileMenu, Sumt04SearchType } from './sumt04.model';
import { Sumt04Service } from './sumt04.service';


@Component({
  selector: 'app-sumt04-detail',
  templateUrl: './sumt04-detail.component.html'
})
export class Sumt04DetailComponent extends SubscriptionDisposer implements OnInit {
  displayedColumns: string[] = ['systemCode', 'menuCode', 'menuName', 'authorize', 'action'];
  displayedColumnsNodelete: string[] = ['expand', 'systemCode', 'menuCode', 'menuName', 'authorize']
  master = { authorize: [], langCodes: [] as any[] };
  profile: SuProfile = { profileLangs: [] } as SuProfile;
  keyword: string = '';
  actions: any;

  profileDataSource!: FormDatasource<SuProfile>;
  profileLangDataSources: FormDatasource<SuProfileLang>[] = [];
  profileMenuDataSources: FormDatasource<SuProfileMenu>[] = [];
  profileMenus!: MatTableDataSource<FormDatasource<SuProfileMenu>>;

  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    private ms: MessageService,
    private su: Sumt04Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.profileMenus = new MatTableDataSource<FormDatasource<SuProfileMenu>>([]);
    this.route.data.subscribe((data) => {
      this.profile = data.sumt04.detail;
      this.actions = data.sumt04.actions;
      Object.assign(this.master, data.sumt04.master);
      this.rebuildForm();
    });
    this.profileMenus.filterPredicate = this.menusFilterPredicate;
  }

  createProfileForm() {
    const fg = this.fb.group({
      profileCode: [null, [Validators.required, Validators.maxLength(20), Validators.pattern(Pattern.Code)]],
      description: [null, [Validators.required, Validators.maxLength(200)]],
      active: true
    });

    return fg;
  }

  createProfileLangForm(profileLang: SuProfileLang, required: boolean) {
    const fg = this.fb.group({
      profileName: [null, Validators.maxLength(200)]
    });
    if (required) {
      fg.controls.profileName.addValidators(Validators.required);
    }
    return fg;
  }

  createAuthorizeForm(auth: Authorize): FormGroup {
    return this.fb.group({
      description: [auth.description],
      authorizeActionCode: [auth.authorizeActionCode],
      flag: [auth.flag],
      rowVersion: [auth.rowVersion]
    });
  }

  createAuthMenu(profileMenu: SuProfileMenu): FormGroup {
    const combinedAuthorizeData = profileMenu.authorize ? profileMenu.authorize.map((auth: Authorize) => ({
      formDatasource: new FormDatasource<Authorize>(auth, this.createAuthorizeForm(auth)),
      formGroup: this.createAuthorizeForm(auth)
    })) : [];

    const authorizeArray = this.fb.array(combinedAuthorizeData.map(data => data.formGroup));

    const fg = this.fb.group({
      profileCode: [null],
      languageCode: [null],
      menuCode: [null],
      menuName: [null],
      authorize: authorizeArray
    });

    return fg;
  }

  getAuthorizeFormArray(formGroup: FormGroup): FormArray {
    return formGroup.get('authorize') as FormArray;
  }

  rebuildForm() {
    this.profileLangDataSources = [];
    this.profileMenuDataSources = [];

    this.profileDataSource = new FormDatasource<SuProfile>(this.profile, this.createProfileForm());

    if (this.profile.rowVersion) {
     
      this.profileDataSource.form.controls.profileCode.disable({ emitEvent: false });
      this.profile.profileMenus.forEach(menu => {
        const menuDataSource = new FormDatasource<SuProfileMenu>(menu, this.createAuthMenu(menu));
        this.profileMenuDataSources.push(menuDataSource);
      });
      if (this.checkDifferentSystemCode() == true) {
        this.profileDataSource.form.controls.active.disable({ emitEvent: false });
      }else {
        this.profileDataSource.form.controls.active.enable({ emitEvent: false });
      }
      this.reload();
    }

    this.master.langCodes.forEach(lang => {
      let profileLang = this.profile.profileLangs.find(item => item.languageCode == lang.value);
      if (!profileLang) {
        profileLang = new SuProfileLang();
        profileLang.languageCode = lang.value;
      }
      profileLang.langName = lang.text;
      const langDataSource = new FormDatasource<SuProfileLang>(profileLang, this.createProfileLangForm(profileLang, lang.requireFlag));
      this.profileLangDataSources.push(langDataSource);
    })
  }

  reload() {
    this.profileMenus.data = this.profileMenuDataSources.filter(o => !o.isDelete);
  }

  add() {
    const existingMenus = this.profileMenuDataSources
      .filter(source => !source.isDelete)
      .map(source => source.model);

    this.modal.open(Sumt04MenuComponent, { 
      data: { 
        master: this.master,
        existingMenus: existingMenus
      } 
    }, Size.ExtraLarge).subscribe((result: SuProfileMenu[]) => {
      if (result) {
        if (result.length) {
          result.forEach(data => {
            data.authorize = this.master.authorize;
          });
          const addingMenuDataSources = result.map((item: SuProfileMenu) => new FormDatasource<SuProfileMenu>(item, this.createAuthMenu(item)));
          this.profileMenuDataSources = this.profileMenuDataSources.concat(addingMenuDataSources);
          this.reload();
          this.profileDataSource.form.markAsDirty();
        }
      }
    })
  }

  remove(source: FormDatasource<SuProfileMenu>) {
    if (source.isAdd) {
      this.profileMenuDataSources = this.profileMenuDataSources.filter(o => o.id !== source.id);
    }
    else source.markForDelete();
    this.reload();
    this.rebuildForm();
    this.profileDataSource.form.markAsDirty();
  }

  save() {
    let invalid = false;

    this.util.markFormGroupTouched(this.profileDataSource.form);
    if (this.profileDataSource.form.invalid) invalid = true;

    if (this.profileLangDataSources.some(source => source.form.invalid)) {
      this.profileLangDataSources.forEach(source => this.util.markFormGroupTouched(source.form));
      this.ms.warning('message.STD00027', ['label.SUMT04.ProfileName'])
      invalid = true;
    }
    
    if (this.profileMenuDataSources.filter(o => !o.isDelete).length <= 0) {
      this.ms.warning('message.STD00012', ['label.SUMT04.Menu']);
      invalid = true;
    }
      
    if (invalid) return;
  
    this.profileDataSource.updateValue();
  
    this.profileLangDataSources.forEach(dataSource => {
      dataSource.updateValue();
    })
    
    this.profileMenuDataSources.forEach(dataSource => {
      const authorizeArray = dataSource.form.get('authorize') as FormArray;
      const filteredValues = authorizeArray.value.filter((auth: any) => (
        auth.flag === true && auth.rowVersion === null) || (auth.flag === false && auth.rowVersion));
      this.setFilteredValues(authorizeArray, filteredValues);
      dataSource.updateValue();
    })

    this.profile.profileLangs = this.profileLangDataSources.map(source => source.model);
    this.profile.profileMenus = this.profileMenuDataSources.filter(source => !source.isNormal).map(source => source.model);

    if (this.checkDifferentSystemCode() == true) {
      this.profile.active = false;
    }
    
    this.su.save(this.profile).pipe(
      switchMap(() => this.su.getProfile(this.profile.profileCode))
    ).subscribe(profile => {
      this.profile = profile;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
    

  }

  setFilteredValues(formArray: FormArray, values: any[]) {

    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }

    values.forEach(value => {
      formArray.push(this.createAuthorizeForm(value));
    });
  }

  onSearch(value: string, type: Sumt04SearchType) {
    this.profileMenus.filter = value;
    this.profileMenus.paginator.firstPage();
  }

  menusFilterPredicate = (data: FormDatasource<SuProfileMenu>, filter: string): boolean => {
    const matchFilter = [];
    const val = data.model.menuCode + data.model.menuName + data.model.systemCode;
    matchFilter.push(val.toLowerCase().includes(filter.trim().toLowerCase()));
    return matchFilter.every(Boolean);
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.profileDataSource.form.dirty || this.profileLangDataSources.some(source => source.form.dirty)) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }

  checkReadOnly(row: any, form: any) {
    setTimeout(() => {
      if (row.controls.authorizeActionCode.value == 4 && row.controls.flag.value == true) {
        form.get('authorize').controls.forEach(control => {
          if (control.get('authorizeActionCode')?.value == 2) {
            control.get('flag')?.setValue(true, { emitEvent: false });
          }
        });
      }
    }, 50);
  }

  // เช็คว่า checkbox ของสิทธิ์นั้นๆ ถูกเลือกทั้งหมดหรือไม่
  isAllChecked(actionCode: number): boolean {
    return this.profileMenuDataSources
      .filter(ds => !ds.isDelete)
      .every(ds => {
        const authArray = ds.form.get('authorize') as FormArray;
        const control = authArray.controls.find(c => c.get('authorizeActionCode')?.value === actionCode);
        return control?.get('flag')?.value === true;
      });
  }

  // เปลี่ยนสถานะติ๊กทั้งหมด
  toggleAll(actionCode: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.profileMenuDataSources
      .filter(ds => !ds.isDelete)
      .forEach(ds => {
        const authArray = ds.form.get('authorize') as FormArray;
        const control = authArray.controls.find(c => c.get('authorizeActionCode')?.value === actionCode);
        if (control) {
          control.get('flag')?.setValue(checked, { emitEvent: true });  // 🔁 emit change
          control.get('flag')?.markAsDirty();                            // ✅ mark dirty
          ds.form.markAsDirty();                                         // ✅ mark parent dirty
        }
      });
    this.profileDataSource.form.markAsDirty(); // ✅ ให้รู้ว่ามีการเปลี่ยนแปลงรวม
  }

  checkDifferentSystemCode(){
    let hasDifferent = false;

    const profileMenuNotDelete = this.profileMenuDataSources.filter(o => !o.isDelete)
    const baseSystemCode = profileMenuNotDelete[0].model.systemCode
    
    profileMenuNotDelete.forEach(source => {
      if (source.model.systemCode != baseSystemCode) {
        hasDifferent = true
      }
    })

    return hasDifferent
  }
}
