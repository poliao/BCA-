import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
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
  allCategories: any[] = [];
  categories: any[] = [];
  isPaper = false;
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
      
      this.allCategories = data.pomt02.master || [];
      const allCategories = this.allCategories;
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
      purchasePrice: [null, [Validators.required]],
      width: [null],
      length: [null],
      active: [true],
      sizes: this.fb.array([])
    });

    if (this.item.id) {
        fg.controls.itemCode.disable();
    }

    return fg;
  }

  rebuildForm() {
    this.itemDataSource = new FormDatasource<Pomt02>(this.item, this.createForm());
    const sizesFormArray = this.itemDataSource.form.get('sizes') as FormArray;
    sizesFormArray.clear();
    
    if (this.item.sizes && this.item.sizes.length > 0) {
        this.item.sizes.forEach(size => {
            const sizeFg = this.fb.group({
                id: [size.id],
                rowVersion: [size.rowVersion],
                width: [size.width, Validators.required],
                length: [size.length, Validators.required],
                grams: this.fb.array([])
            });
            const gramsFormArray = sizeFg.get('grams') as FormArray;
            if (size.grams && size.grams.length > 0) {
                size.grams.forEach(g => {
                    gramsFormArray.push(this.fb.group({
                        id: [g.id],
                        rowVersion: [g.rowVersion],
                        gram: [g.gram, Validators.required],
                        purchasePrice: [g.purchasePrice, Validators.required]
                    }));
                });
            }
            sizesFormArray.push(sizeFg);
        });
    }
    
    const categoryCtrl = this.itemDataSource.form.get('categoryCode');
    if (categoryCtrl) {
        this.isPaper = this.checkIsPaper(categoryCtrl.value);
        categoryCtrl.valueChanges.subscribe(val => {
            setTimeout(() => {
                this.isPaper = this.checkIsPaper(val);
            }, 0);
        });
    }
  }

  get sizes(): FormArray {
    return this.itemDataSource.form.get('sizes') as FormArray;
  }

  grams(sizeIndex: number): FormArray {
    return this.sizes.at(sizeIndex).get('grams') as FormArray;
  }

  addSize() {
    this.sizes.push(this.fb.group({
      id: [null],
      rowVersion: [null],
      width: [null, Validators.required],
      length: [null, Validators.required],
      grams: this.fb.array([])
    }));
  }

  removeSize(index: number) {
    this.sizes.removeAt(index);
    this.sizes.markAsDirty();
  }

  addGram(sizeIndex: number) {
    this.grams(sizeIndex).push(this.fb.group({
      id: [null],
      rowVersion: [null],
      gram: [null, Validators.required],
      purchasePrice: [null, Validators.required]
    }));
  }

  removeGram(sizeIndex: number, gramIndex: number) {
    this.grams(sizeIndex).removeAt(gramIndex);
    this.sizes.markAsDirty();
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

  private checkIsPaper(categoryCode: string): boolean {
    if (!categoryCode) return false;
    const category = this.allCategories.find(c => c.categoryCode === categoryCode);
    if (!category) return false;

    const name = (category.categoryNameTh || '') + (category.categoryNameEn || '');
    if (name.includes('กระดาษ') || name.toLowerCase().includes('paper')) {
      return true;
    }

    if (category.parentCategoryCode) {
      return this.checkIsPaper(category.parentCategoryCode);
    }

    return false;
  }
}
