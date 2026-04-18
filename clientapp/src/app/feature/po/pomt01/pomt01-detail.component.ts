import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Pomt01 } from './pomt01.model';
import { Pomt01Service } from './pomt01.service';
import { of, switchMap } from 'rxjs';

@Component({
  templateUrl: './pomt01-detail.component.html'
})
export class Pomt01DetailComponent implements OnInit {
  category: Pomt01 = {} as Pomt01;
  categoryDataSource!: FormDatasource<Pomt01>;
  actions: any;
  master: Pomt01[] = [];
  saving = false;

  constructor(
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly po: Pomt01Service,
    private readonly ms: MessageService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.category = data.pomt01.detail;
      this.actions = data.pomt01.actions;
      this.master = data.pomt01.master || [];
      
      const state = window.history.state;
      if (state?.parentCategoryCode && !this.category.id) {
          this.category.parentCategoryCode = state.parentCategoryCode;
      }

      this.rebuildForm();
    });
  }

  createForm() {
    const fg = this.fb.group({
      id: [null],
      categoryCode: [null, [Validators.required, Validators.maxLength(50)]],
      categoryNameTh: [null, [Validators.required, Validators.maxLength(200)]],
      categoryNameEn: [null, [Validators.maxLength(200)]],
      parentCategoryCode: [null],
      active: [true],
      sequence: [null]
    });

    if (this.category.id) {
        fg.controls.categoryCode.disable();
    }

    return fg;
  }

  rebuildForm() {
    this.categoryDataSource = new FormDatasource<Pomt01>(this.category, this.createForm());
  }

  save() {
    if (this.categoryDataSource.form.invalid) {
      this.util.markFormGroupTouched(this.categoryDataSource.form);
      return;
    }

    this.categoryDataSource.updateValue();
    this.saving = true;
    
    this.po.save(this.category).subscribe({
      next: (res) => {
        this.ms.success('message.STD00006');
        this.router.navigate(['/po/pomt01']);
      },
      error: () => {
        this.saving = false;
      }
    });
  }
}
