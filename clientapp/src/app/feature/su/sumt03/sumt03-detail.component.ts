import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Pattern } from '@app/shared/components/textbox/pattern';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, of, switchMap, takeUntil } from 'rxjs';
import { SuMenu, SuMenuLabel } from './sumt03.model';
import { Sumt03Service } from './sumt03.service';

@Component({
  selector: 'app-sumt03-detail',
  templateUrl: './sumt03-detail.component.html'
})
export class Sumt03DetailComponent extends SubscriptionDisposer implements OnInit {
  master = { systemCodes: [], mainMenus: [], programCodes: [], langCodes: [] as any[] };
  suMenu: SuMenu = { menuLabels: [] } as SuMenu;

  suMenuDataSource!: FormDatasource<SuMenu>;
  suMenuLabelDataSources: FormDatasource<SuMenuLabel>[] = [];

  saving = false;
  actions: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    private ms: MessageService,
    private su: Sumt03Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.suMenu = data.sumt03.detail;
      this.actions = data.sumt03.actions;
      this.master.systemCodes = data.sumt03.master.systemCodes;
      this.master.langCodes = data.sumt03.master.langCodes;
      this.rebuildForm();
    });
  }

  createMenuForm(menu: SuMenu) {
    const fg = this.fb.group({
      systemCode: [null, [Validators.required]],
      mainMenu: null,
      menuCode: [null, [Validators.required, Validators.maxLength(20), Validators.pattern(Pattern.UpperOnly)]],
      programCode: null,
      icon: [null, [Validators.required, Validators.maxLength(50)]],
      active: true
    })
    fg.controls.systemCode.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(value => {
      this.master.mainMenus = [];
      if (!fg.controls.systemCode.pristine) fg.controls.mainMenu.setValue(null);
      if (value) this.su.getMasterDependency('mainMenu', { systemCode: value, mainMenu: menu.menuCode }).subscribe(dependency => this.master.mainMenus = dependency.mainMenus);
      this.master.programCodes = [];
      if (!fg.controls.systemCode.pristine) fg.controls.programCode.setValue(null);
      this.su.getMasterDependency('program', { systemCode: value }).subscribe(dependency => this.master.programCodes = dependency.programCodes);
    });
    return fg;
  }

  createMenuLabelForm(menuLabel: SuMenuLabel,required:boolean) {
    const fg = this.fb.group({
      menuName: [null, [Validators.maxLength(200)]]
    });
    if (required) {
      fg.controls.menuName.addValidators(Validators.required);
    }
    return fg;
  }

  rebuildForm() {
    this.suMenuDataSource = new FormDatasource<SuMenu>(this.suMenu, this.createMenuForm(this.suMenu));
    if (this.suMenu.rowVersion) {
      this.suMenuDataSource.form.controls.systemCode.disable({ emitEvent: false });
      this.suMenuDataSource.form.controls.menuCode.disable({ emitEvent: false });
    }
    this.suMenuLabelDataSources = [];
    this.master.langCodes.forEach(lang => {
      let label = this.suMenu.menuLabels.find(item => item.languageCode == lang.value);
      if (!label) {
        label = new SuMenuLabel();
        label.languageCode = lang.value;
      }
      label.langName = lang.text;
      const labelDataSource = new FormDatasource<SuMenuLabel>(label, this.createMenuLabelForm(label,lang.requireFlag));
      this.suMenuLabelDataSources.push(labelDataSource);
    });
  }

  save() {
    let invalid = false;

    this.util.markFormGroupTouched(this.suMenuDataSource.form);
    if (this.suMenuDataSource.form.invalid) invalid = true;

    if (this.suMenuLabelDataSources.some(source => source.form.invalid)) {
      this.suMenuLabelDataSources.forEach(source => this.util.markFormGroupTouched(source.form));
      this.ms.warning('message.STD00027', ['label.SUMT03.MenuName']);
      invalid = true;
    }

    if (invalid) return;

    this.suMenuDataSource.updateValue();

    this.suMenuLabelDataSources.forEach(dataSource => {
      dataSource.updateValue();
    })

    const menuLabels = this.suMenuLabelDataSources.filter(source => !source.isNormal).map(source => source.model);
    this.suMenu.menuLabels = menuLabels;

    this.su.save(this.suMenu).pipe(
      switchMap(() => this.su.getMenu(this.suMenu.menuCode, this.suMenu.systemCode))
    ).subscribe(menu => {
      this.suMenu = menu;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
  }


  canDeactivate(): Observable<boolean> {
    if (this.suMenuDataSource.form.dirty || this.suMenuLabelDataSources.some(source => source.form.dirty)) {
      return this.modal.confirm("message.STD00002");
    }
    return of(true);
  }
}
