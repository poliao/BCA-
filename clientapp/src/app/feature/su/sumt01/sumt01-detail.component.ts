import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, of, switchMap } from 'rxjs';
import { SuMenu } from './sumt01.model';
import { Sumt01Service } from './sumt01.service';

@Component({
  selector: 'app-sumt01-detail',
  templateUrl: './sumt01-detail.component.html'
})
export class Sumt01DetailComponent extends SubscriptionDisposer implements OnInit {
  menu: SuMenu = {} as SuMenu;
  menuDataSource!: FormDatasource<SuMenu>;
  actions: any;
  saving = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly modal: ModalService,
    private readonly ms: MessageService,
    private readonly su: Sumt01Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.menu = data.sumt01.detail;
      this.actions = data.sumt01.actions;
      this.rebuildForm();
    });
  }

  createMenuForm() {
    const fg = this.fb.group({
      id: [null],
      menuCode: [null, [Validators.required, Validators.maxLength(50)]],
      menuName: [null, [Validators.required, Validators.maxLength(100)]],
      url: [null, [Validators.maxLength(255)]],
      icon: [null, [Validators.maxLength(100)]],
      parentId: [null],
      sequence: [null]
    });
    return fg;
  }

  rebuildForm() {
    this.menuDataSource = new FormDatasource<SuMenu>(this.menu, this.createMenuForm());
  }

  save() {
    if (this.menuDataSource.form.invalid) {
      this.util.markFormGroupTouched(this.menuDataSource.form);
      return;
    }
    this.menuDataSource.updateValue();
    this.saving = true;
    this.su.save(this.menu).pipe(
      switchMap((res) => this.su.getMenu(res.id))
    ).subscribe({
      next: (menu) => {
        this.menu = menu;
        this.rebuildForm();
        this.ms.success('message.STD00006');
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  canDeactivate(): Observable<boolean> {
    if (this.menuDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return of(true);
  }
}
