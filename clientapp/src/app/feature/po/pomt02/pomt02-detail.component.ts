import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Pomt02 } from './pomt02.model';
import { Pomt02Service } from './pomt02.service';

@Component({
  templateUrl: './pomt02-detail.component.html'
})
export class Pomt02DetailComponent implements OnInit {
  item: Pomt02 = {} as Pomt02;
  itemDataSource!: FormDatasource<Pomt02>;
  actions: any;
  categories: any[] = [];
  saving = false;

  constructor(
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly po: Pomt02Service,
    private readonly ms: MessageService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.item = data.pomt02.detail;
      this.actions = data.pomt02.actions;
      
      const allCategories: any[] = data.pomt02.master || [];
      this.categories = [];
      
      // Build a flattened hierarchical list supporting unlimited depth
      const buildTree = (parentCode: string | null, indent: string) => {
        const children = allCategories.filter(c => parentCode ? c.parentCategoryCode === parentCode : !c.parentCategoryCode);
        children.forEach(child => {
            const prefix = indent ? indent + '- ' : '';
            this.categories.push({ 
                ...child, 
                displayName: prefix + '[' + child.categoryCode + '] ' + child.categoryNameTh 
            });
            buildTree(child.categoryCode, indent + '\u00A0\u00A0\u00A0\u00A0');
        });
      };
      
      buildTree(null, '');
      this.rebuildForm();
    });
  }

  createForm() {
    const fg = this.fb.group({
      id: [null],
      itemCode: [null, [Validators.required, Validators.maxLength(50)]],
      itemNameTh: [null, [Validators.required, Validators.maxLength(200)]],
      itemNameEn: [null, [Validators.maxLength(200)]],
      categoryCode: [null, [Validators.required]],
      minimumOrderQuantity: [null, [Validators.required]],
      unit: [null, [Validators.required, Validators.maxLength(50)]],
      leadTimeDays: [null],
      active: [true]
    });

    if (this.item.id) {
        fg.controls.itemCode.disable();
    }

    return fg;
  }

  rebuildForm() {
    this.itemDataSource = new FormDatasource<Pomt02>(this.item, this.createForm());
  }

  save() {
    if (this.itemDataSource.form.invalid) {
      this.util.markFormGroupTouched(this.itemDataSource.form);
      return;
    }

    this.itemDataSource.updateValue();
    this.saving = true;
    
    this.po.save(this.item).subscribe({
      next: (res) => {
        this.ms.success('message.STD00006');
        this.router.navigate(['/po/pomt02']);
      },
      error: () => {
        this.saving = false;
      }
    });
  }
}
