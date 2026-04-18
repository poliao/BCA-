// Standardizing RD Search Implementation
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { Qtmt01, Qtmt01ItemBase, Qtmt01Paper, Qtmt01Print, Qtmt01Coating, Qtmt01Stamp, Qtmt01Glue, Qtmt01Fold, Qtmt01Design } from './qtmt01.model';
import { Qtmt01Service } from './qtmt01.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { Qtmt01RdLookupComponent } from './qtmt01-rd-lookup.component';

@Component({
  templateUrl: './qtmt01-detail.component.html',
})
export class Qtmt01DetailComponent extends SubscriptionDisposer implements OnInit {
  quotation: Qtmt01 = new Qtmt01();
  quotationDataSource!: FormDatasource<Qtmt01>;

  // Categorized data sources
  categories = ['PAPER', 'PRINT', 'COATING', 'STAMP', 'GLUE', 'FOLD', 'DESIGN'];
  itemDataSources: { [key: string]: FormDatasource<Qtmt01ItemBase>[] } = {};
  tableDataSources: { [key: string]: MatTableDataSource<FormDatasource<Qtmt01ItemBase>> } = {};

  displayedColumns: string[] = ['index', 'productName', 'quantity', 'unit', 'cost', 'marginPercent', 'unitPrice', 'amount', 'action'];
  paperColumns: string[] = ['index', 'productName', 'gsm', 'paperSize', 'paperType', 'quantity', 'unit', 'cost', 'marginPercent', 'unitPrice', 'amount', 'action'];
  printColumns: string[] = ['index', 'productName', 'colorCount', 'sides', 'quantity', 'unit', 'cost', 'marginPercent', 'unitPrice', 'amount', 'action'];
  coatingColumns: string[] = ['index', 'productName', 'coatingType', 'quantity', 'unit', 'cost', 'marginPercent', 'unitPrice', 'amount', 'action'];
  stampColumns: string[] = ['index', 'productName', 'stampType', 'quantity', 'unit', 'cost', 'marginPercent', 'unitPrice', 'amount', 'action'];
  glueColumns: string[] = ['index', 'productName', 'glueType', 'quantity', 'unit', 'cost', 'marginPercent', 'unitPrice', 'amount', 'action'];
  foldColumns: string[] = ['index', 'productName', 'foldType', 'quantity', 'unit', 'cost', 'marginPercent', 'unitPrice', 'amount', 'action'];
  designColumns: string[] = ['index', 'productName', 'designComplexity', 'quantity', 'unit', 'cost', 'marginPercent', 'unitPrice', 'amount', 'action'];

  saving = false;
  actions: any;

  constructor(
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly ms: MessageService,
    private readonly modal: ModalService,
    private readonly route: ActivatedRoute,
    private readonly service: Qtmt01Service
  ) {
    super();
  }

  // Customer Source logic
  customerSource: 'INTERNAL' | 'RD' = 'INTERNAL';
  rdKeyword = '';
  searchingRD = false;

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.quotation = data.qtmt01.detail || new Qtmt01();
      this.actions = data.qtmt01.actions;
      this.rebuildForm();
    });
  }

  createQuotationForm() {
    return this.fb.group({
      quotationNo: [null, [Validators.required]],
      quotationDate: [new Date(), [Validators.required]],
      expiryDate: [null],
      customerCode: [null, [Validators.required]],
      customerName: [null],
      contactName: [null],
      contactPhone: [null],
      address: [null],
      branchType: [null],
      zipCode: [null],
      taxId: [null],
      remark: [null],
      status: ['Draft'],
      jobName: [null],
      jobType: [null],
      vatRate: [7],
      whtRate: [0],
      totalCost: [0],
      totalAmount: [0],
      vatAmount: [0],
      whtAmount: [0],
      grandTotal: [0],
      profitAmount: [0],
      profitMarginPercent: [0]
    });
  }

  createItemForm(item: Qtmt01ItemBase, type: string) {
    const fg = this.fb.group({
      productName: [item.productName],
      description: [item.description],
      quantity: [item.quantity || 1, [Validators.required, Validators.min(1)]],
      unit: [item.unit],
      cost: [item.cost || 0, [Validators.required, Validators.min(0)]],
      marginPercent: [item.marginPercent || 0],
      unitPrice: [item.unitPrice || 0],
      amount: [item.amount || 0]
    });

    // Add specialized fields
    const form = fg as any;
    if (type === 'PAPER') {
      form.addControl('gsm', this.fb.control((item as any).gsm));
      form.addControl('paperSize', this.fb.control((item as any).paperSize));
      form.addControl('paperType', this.fb.control((item as any).paperType));
    } else if (type === 'PRINT') {
      form.addControl('colorCount', this.fb.control((item as any).colorCount));
      form.addControl('sides', this.fb.control((item as any).sides));
    } else if (type === 'COATING') {
      form.addControl('coatingType', this.fb.control((item as any).coatingType));
    } else if (type === 'STAMP') {
      form.addControl('stampType', this.fb.control((item as any).stampType));
    } else if (type === 'GLUE') {
      form.addControl('glueType', this.fb.control((item as any).glueType));
    } else if (type === 'FOLD') {
      form.addControl('foldType', this.fb.control((item as any).foldType));
    } else if (type === 'DESIGN') {
      form.addControl('designComplexity', this.fb.control((item as any).designComplexity));
    }

    // Subscriptions for automatic calculations
    fg.valueChanges.subscribe(() => {
      this.calculateItem(fg);
    });

    return fg;
  }

  rebuildForm() {
    this.quotationDataSource = new FormDatasource<Qtmt01>(this.quotation, this.createQuotationForm());

    // Initialize categorized lists
    this.categories.forEach(cat => {
      this.itemDataSources[cat] = [];
      this.tableDataSources[cat] = new MatTableDataSource<FormDatasource<Qtmt01ItemBase>>();
    });

    if (!this.quotation.quotationNo) {
      this.generateQuotationNo();
    }

    // Load existing items into their respective categories
    if (this.quotation.papers) this.quotation.papers.forEach(i => this.addItemDataSource(i, 'PAPER'));
    if (this.quotation.printings) this.quotation.printings.forEach(i => this.addItemDataSource(i, 'PRINT'));
    if (this.quotation.coatings) this.quotation.coatings.forEach(i => this.addItemDataSource(i, 'COATING'));
    if (this.quotation.stamps) this.quotation.stamps.forEach(i => this.addItemDataSource(i, 'STAMP'));
    if (this.quotation.gluing) this.quotation.gluing.forEach(i => this.addItemDataSource(i, 'GLUE'));
    if (this.quotation.folding) this.quotation.folding.forEach(i => this.addItemDataSource(i, 'FOLD'));
    if (this.quotation.designs) this.quotation.designs.forEach(i => this.addItemDataSource(i, 'DESIGN'));

    this.calculateTotalSummary();

    // Listen for global changes to update summary
    this.quotationDataSource.form.get('vatRate')?.valueChanges.subscribe(() => this.calculateTotalSummary());
    this.quotationDataSource.form.get('whtRate')?.valueChanges.subscribe(() => this.calculateTotalSummary());
  }

  addItem(type: string) {
    let item: any;
    switch (type) {
      case 'PAPER': item = { productName: 'Paper' }; break;
      case 'PRINT': item = { productName: 'Printing' }; break;
      case 'COATING': item = { productName: 'Coating' }; break;
      case 'STAMP': item = { productName: 'Stamp' }; break;
      case 'GLUE': item = { productName: 'Glue' }; break;
      case 'FOLD': item = { productName: 'Fold' }; break;
      case 'DESIGN': item = { productName: 'Design' }; break;
      default: item = {};
    }
    this.addItemDataSource(item, type);
  }

  addItemDataSource(item: Qtmt01ItemBase, type: string) {
    const dataSource = new FormDatasource<Qtmt01ItemBase>(item, this.createItemForm(item, type));
    this.itemDataSources[type].push(dataSource);
    this.refreshTable(type);
    this.calculateTotalSummary();
  }

  removeItem(dataSource: FormDatasource<Qtmt01ItemBase>, type: string) {
    if (dataSource.isAdd) {
      const index = this.itemDataSources[type].indexOf(dataSource);
      this.itemDataSources[type].splice(index, 1);
    } else {
      dataSource.markForDelete();
    }
    this.refreshTable(type);
    this.calculateTotalSummary();
  }

  refreshTable(type: string) {
    this.tableDataSources[type].data = this.itemDataSources[type].filter(ds => !ds.isDelete);
  }

  // Helper to get all active items across all categories
  get allActiveItemDataSources(): FormDatasource<Qtmt01ItemBase>[] {
    let all: FormDatasource<Qtmt01ItemBase>[] = [];
    this.categories.forEach(cat => {
      all = all.concat(this.itemDataSources[cat].filter(ds => !ds.isDelete));
    });
    return all;
  }

  calculateItem(fg: FormGroup) {
    const cost = fg.get('cost')?.value || 0;
    const margin = fg.get('marginPercent')?.value || 0;
    const qty = fg.get('quantity')?.value || 0;

    // Margin Formula: Price = Cost / (1 - Margin/100)
    let unitPrice = 0;
    if (margin < 100) {
      unitPrice = cost / (1 - (margin / 100));
    } else {
      unitPrice = cost; // Avoiding division by zero if margin is 100% or more (though 100% is impossible in this formula)
    }

    const amount = unitPrice * qty;

    fg.get('unitPrice')?.setValue(unitPrice, { emitEvent: false });
    fg.get('amount')?.setValue(amount, { emitEvent: false });

    this.calculateTotalSummary();
  }

  calculateTotalSummary() {
    let totalCost = 0;
    let totalAmount = 0;

    this.allActiveItemDataSources.forEach(s => {
      const fg = s.form;
      totalCost += (fg.get('cost')?.value || 0) * (fg.get('quantity')?.value || 0);
      totalAmount += fg.get('amount')?.value || 0;
    });

    const vatRate = this.quotationDataSource.form.get('vatRate')?.value || 0;
    const whtRate = this.quotationDataSource.form.get('whtRate')?.value || 0;

    const vatAmount = totalAmount * (vatRate / 100);
    const whtAmount = totalAmount * (whtRate / 100);
    const grandTotal = totalAmount + vatAmount - whtAmount;
    const profitAmount = totalAmount - totalCost;
    const profitMarginPercent = totalAmount > 0 ? (profitAmount / totalAmount) * 100 : 0;

    this.quotationDataSource.form.patchValue({
      totalCost,
      totalAmount,
      vatAmount,
      whtAmount,
      grandTotal,
      profitAmount,
      profitMarginPercent
    }, { emitEvent: false });
  }

  generateQuotationNo() {
    const now = new Date();
    const year = (now.getFullYear() + 543).toString().substring(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const running = '0001'; // In a real app, this would come from the server
    const no = `QT${year}${month}${day}-${running}`;
    this.quotationDataSource.form.get('quotationNo')?.setValue(no);
  }

  save() {
    this.util.markFormGroupTouched(this.quotationDataSource.form);
    this.categories.forEach(cat => this.itemDataSources[cat].forEach(s => this.util.markFormGroupTouched(s.form)));

    const isItemsInvalid = this.categories.some(cat =>
      this.itemDataSources[cat].some(s => s.form.invalid && !s.isDelete)
    );

    if (this.quotationDataSource.form.invalid || isItemsInvalid) {
      this.ms.warning('Please fill in all required fields correctly.');
      return;
    }

    this.saving = true;
    this.quotationDataSource.updateValue();
    this.categories.forEach(cat => this.itemDataSources[cat].forEach(s => s.updateValue()));

    const data = {
      ...this.quotationDataSource.model,
      papers: this.itemDataSources['PAPER'].map(s => s.model),
      printings: this.itemDataSources['PRINT'].map(s => s.model),
      coatings: this.itemDataSources['COATING'].map(s => s.model),
      stamps: this.itemDataSources['STAMP'].map(s => s.model),
      gluing: this.itemDataSources['GLUE'].map(s => s.model),
      folding: this.itemDataSources['FOLD'].map(s => s.model),
      designs: this.itemDataSources['DESIGN'].map(s => s.model)
    };

    this.service.save(data).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.ms.success('Quotation saved successfully.');
        this.quotation = res;
        this.rebuildForm();
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  onSearchRD() {
    if (!this.rdKeyword || this.rdKeyword.length < 3) {
      this.ms.warning('Please enter at least 3 characters.');
      return;
    }

    this.searchingRD = true;
    this.service.searchRDContact(this.rdKeyword).subscribe({
      next: (res: any) => {
        this.searchingRD = false;
        if (res.status && res.data && res.data.list && res.data.list.length > 0) {
          // Open Modal with results
          this.modal.open(Qtmt01RdLookupComponent, { items: res.data.list }, Size.Large).subscribe(result => {
            if (result) {
              this.populateQuotationFromRD(result);
            }
          });
        } else {
          this.ms.info(res.message || 'No data found from RD.');
        }
      },
      error: (err) => {
        this.searchingRD = false;
        this.ms.error('Error connecting to RD search service.');
      }
    });
  }

  populateQuotationFromRD(result: any) {
    this.quotationDataSource.form.patchValue({
      customerName: result.name ? result.name.trim() : '',
      taxId: result.taxId || result.nid || '',
      address: result.addressLocal || result.addressDescription || '',
      zipCode: result.zipCode || '',
      branchType: result.branchType || '',
      customerCode: null
    });
  }

  onCustomerSourceChange() {
  }

  onCustomerSelected(event: any) {
    if (event) {
      // Logic for when an internal customer is selected via lookup
      this.quotationDataSource.form.patchValue({
        customerName: event.customerName,
        taxId: event.taxId,
        address: event.address,
        contactName: event.contactName,
        contactPhone: event.contactPhone,
        zipCode: event.zipCode,
        branchType: event.branchType
      });
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    const isDirty = this.quotationDataSource.form.dirty ||
      this.categories.some(cat => this.itemDataSources[cat].some(s => s.form.dirty));

    if (isDirty) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }
}
