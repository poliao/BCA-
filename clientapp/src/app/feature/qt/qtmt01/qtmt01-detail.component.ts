import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable } from 'rxjs';
import { Qtmt01, Qtmt01Box, Qtmt01Part } from './qtmt01.model';
import { Qtmt01Service } from './qtmt01.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { Qtmt01RdLookupComponent } from './qtmt01-rd-lookup.component';

@Component({
  templateUrl: './qtmt01-detail.component.html',
})
export class Qtmt01DetailComponent extends SubscriptionDisposer implements OnInit {
  quotation: Qtmt01 = new Qtmt01();
  quotationDataSource!: FormDatasource<Qtmt01>;

  saving = false;
  actions: any;

  // Master Data
  masterProcesses: any[] = [];
  paperOptions: any[] = [];
  printProcesses: any[] = [];

  paperSizeOptions = [
    { value: 'A4', text: 'A4 (210 x 297 mm)' },
    { value: 'A3', text: 'A3 (297 x 420 mm)' },
    { value: 'A5', text: 'A5 (148 x 210 mm)' },
    { value: 'Custom', text: 'กำหนดขนาดเอง' }
  ];

  printStyles = [
    { value: 'หน้าเดียว', text: 'พิมพ์หน้าเดียว' },
    { value: 'กลับนอก', text: 'พิมพ์ 2 หน้า (กลับนอก)' },
    { value: 'กลับในตัว', text: 'พิมพ์ 2 หน้า (กลับในตัว)' }
  ];

  coatingOptions = [
    { value: 'OPP เงา', text: 'OPP เงา' },
    { value: 'OPP ด้าน', text: 'OPP ด้าน' },
    { value: 'UV', text: 'อาบ UV' },
    { value: 'Spot UV', text: 'Spot UV' }
  ];

  stampOptions = [
    { value: 'เคเงิน', text: 'ปั๊มเคเงิน (Silver Foil)' },
    { value: 'เคทอง', text: 'ปั๊มเคทอง (Gold Foil)' },
    { value: 'ปั๊มนูน', text: 'ปั๊มนูน (Embossing)' },
    { value: 'ปั๊มจม', text: 'ปั๊มจม (Debossing)' },
    { value: 'ปั๊มไดคัท', text: 'ปั๊มไดคัท (Die-cutting)' },
    { value: 'ปั๊มไมโครดอท', text: 'ปั๊มไมโครดอท (Microdot)' }
  ];

  fluteOptions = [
    { value: 'ลอน E', text: 'ลอน E (บาง)' },
    { value: 'ลอน B', text: 'ลอน B (หนาปานกลาง)' },
    { value: 'ลอน C', text: 'ลอน C (หนา)' }
  ];

  rdKeyword = '';
  searchingRD = false;

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

  get boxesArray(): FormArray {
    return this.quotationDataSource.form.get('boxes') as FormArray;
  }

  getPartsArray(boxIndex: number): FormArray {
    return this.boxesArray.at(boxIndex).get('parts') as FormArray;
  }

  getQuantitiesArray(boxIndex: number): FormArray {
    return this.boxesArray.at(boxIndex).get('quantities') as FormArray;
  }

  getStampsArray(boxIndex: number, partIndex: number): FormArray {
    return this.getPartsArray(boxIndex).at(partIndex).get('stamps') as FormArray;
  }

  generateQuotationNo() {
    const now = new Date();
    const year = (now.getFullYear() + 543).toString().substring(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const running = '0001';
    const no = `QT${year}${month}${day}-${running}`;
    this.quotationDataSource.form.get('quotationNo')?.patchValue(no);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.quotation = data.qtmt01.detail || new Qtmt01();
      
      const rawProcesses = data.qtmt01.master?.processes || [];
      const groups = data.qtmt01.master?.groups || [];
      // Combine groupName into process
      this.masterProcesses = rawProcesses.map((p:any) => {
          const g = groups.find((grp:any) => grp.id === p.groupId);
          return { ...p, _groupName: g ? g.groupName : '' };
      });

      this.paperOptions = this.masterProcesses.filter((p:any) => p._groupName.includes('กระดาษ') || p._groupName.includes('Paper'));
      this.printProcesses = this.masterProcesses.filter((p:any) => p._groupName.includes('พิมพ์'));

      // Default structure if empty
      if (!this.quotation.boxes || this.quotation.boxes.length === 0) {
        let defaultBox = new Qtmt01Box();
        defaultBox.boxName = "กล่องที่ 1";
        defaultBox.orderQuantities = [1000];
        
        let defaultPart = new Qtmt01Part();
        defaultPart.partName = "ตัวกล่อง";
        defaultBox.parts = [defaultPart];
        
        this.quotation.boxes = [defaultBox];
      }
      
      this.actions = data.qtmt01.actions;
      this.rebuildForm();

      if (!this.quotation.quotationNo) {
        this.generateQuotationNo();
      }
    });
  }

  createForm() {
    return this.fb.group({
      quotationNo: [null, [Validators.required]],
      customerName: [null, [Validators.required]],
      taxId: [null],
      address: [null],
      customerCode: [null],
      jobName: [null, [Validators.required]],

      boxes: this.fb.array(
        this.quotation.boxes.map(box => this.createBoxGroup(box))
      )
    });
  }

  createBoxGroup(box: Qtmt01Box): FormGroup {
    return this.fb.group({
      boxName: [box.boxName || 'กล่องใหม่', [Validators.required]],
      quantities: this.fb.array(
        (box.orderQuantities || [1000]).map(qty => new FormControl(qty, [Validators.required, Validators.min(1)]))
      ),
      parts: this.fb.array(
        (box.parts || []).map(part => this.createPartGroup(part))
      )
    });
  }

  createPartGroup(part: Qtmt01Part): FormGroup {
    let fg = this.fb.group({
      partName: [part.partName || 'ส่วนประกอบใหม่', [Validators.required]],
      paperId: [part.paperId || null, [Validators.required]],
      paperSize: [part.paperSize || null, [Validators.required]],
      printProcessId: [part.printProcessId || null, [Validators.required]],
      printStyle: [part.printStyle || 'หน้าเดียว', [Validators.required]],
      printColorFront: [part.printColorFront || null],
      printColorBack: [part.printColorBack || null],
      printCutSizeFront: [part.printCutSizeFront || null],
      printCutSizeBack: [part.printCutSizeBack || null],
      coatingType: [part.coatingType || null],
      isCorrugated: [part.isCorrugated || false],
      fluteType: [part.fluteType || null],
      stamps: this.fb.array(
        (part.stamps || []).map(s => this.createStampGroup(s))
      )
    });

    // Validations logic per part for printing
    fg.get('printStyle')?.valueChanges.subscribe(style => {
      const backColorCtrl = fg.get('printColorBack');
      const backCutCtrl = fg.get('printCutSizeBack');
      if (style === 'กลับนอก') {
        backColorCtrl?.setValidators([Validators.required]);
        backCutCtrl?.setValidators([Validators.required]);
      } else {
        backColorCtrl?.clearValidators();
        backColorCtrl?.patchValue(null);
        backCutCtrl?.clearValidators();
        backCutCtrl?.patchValue(null);
      }
      backColorCtrl?.updateValueAndValidity();
      backCutCtrl?.updateValueAndValidity();
    });

    fg.get('isCorrugated')?.valueChanges.subscribe(checked => {
      if (checked) {
        fg.get('fluteType')?.setValidators([Validators.required]);
      } else {
        fg.get('fluteType')?.clearValidators();
        fg.get('fluteType')?.patchValue(null);
      }
      fg.get('fluteType')?.updateValueAndValidity();
    });

    return fg;
  }

  createStampGroup(stamp?: any): FormGroup {
    return this.fb.group({
      stampType: [stamp?.stampType || null, Validators.required],
      width: [stamp?.width || null, [Validators.required, Validators.min(0.1)]],
      length: [stamp?.length || null, [Validators.required, Validators.min(0.1)]]
    });
  }

  rebuildForm() {
    this.quotationDataSource = new FormDatasource<Qtmt01>(this.quotation, this.createForm());
  }

  // Event Handlers
  addBox() {
    this.boxesArray.push(this.createBoxGroup(new Qtmt01Box()));
  }

  removeBox(index: number) {
    if (this.boxesArray.length > 1) {
      this.boxesArray.removeAt(index);
    } else {
      this.ms.warning('ต้องมีกล่องอย่างน้อย 1 ใบ');
    }
  }

  addQuantity(boxIndex: number) {
    this.getQuantitiesArray(boxIndex).push(new FormControl(1000, [Validators.required, Validators.min(1)]));
  }

  removeQuantity(boxIndex: number, qtyIndex: number) {
    let arr = this.getQuantitiesArray(boxIndex);
    if (arr.length > 1) {
      arr.removeAt(qtyIndex);
    }
  }

  addPart(boxIndex: number) {
    this.getPartsArray(boxIndex).push(this.createPartGroup(new Qtmt01Part()));
  }

  removePart(boxIndex: number, partIndex: number) {
    let arr = this.getPartsArray(boxIndex);
    if (arr.length > 1) {
      arr.removeAt(partIndex);
    } else {
      this.ms.warning('แต่ละกล่องต้องมีชิ้นส่วนอย่างน้อย 1 ชิ้น');
    }
  }

  addStamp(boxIndex: number, partIndex: number) {
    this.getStampsArray(boxIndex, partIndex).push(this.createStampGroup());
  }

  removeStamp(boxIndex: number, partIndex: number, stampIndex: number) {
    this.getStampsArray(boxIndex, partIndex).removeAt(stampIndex);
  }

  // Dynamic Options Caches
  colorOptionsCache: { [processId: number]: any[] } = {};
  cutSizeOptionsCache: { [key: string]: any[] } = {};

  // Dynamic Options Getters
  getColorOptions(boxIndex: number, partIndex: number): any[] {
     const part = this.getPartsArray(boxIndex).at(partIndex).value;
     const processId = part.printProcessId;
     if (!processId) return [];

     if (this.colorOptionsCache[processId]) {
         return this.colorOptionsCache[processId];
     }

     const process = this.printProcesses.find((p:any) => p.id === processId);
     if (!process || !process.pricingTiers) return [];
     
     const colors = Array.from(new Set(process.pricingTiers.map((t:any) => t.colorCount).filter((c:any) => c != null))).sort();
     const options = colors.map(c => ({ value: c, text: `${c} สี` }));
     
     this.colorOptionsCache[processId] = options;
     return options;
  }

  getCutSizeOptions(boxIndex: number, partIndex: number, side: 'front'|'back'): any[] {
     const part = this.getPartsArray(boxIndex).at(partIndex).value;
     const processId = part.printProcessId;
     if (!processId) return [];

     const selectedColor = side === 'front' ? part.printColorFront : part.printColorBack;
     const cacheKey = `${processId}|${selectedColor || 'any'}`;

     if (this.cutSizeOptionsCache[cacheKey]) {
         return this.cutSizeOptionsCache[cacheKey];
     }

     const process = this.printProcesses.find((p:any) => p.id === processId);
     if (!process || !process.pricingTiers) return [];
     
     let tiers = process.pricingTiers;
     if (selectedColor) {
         tiers = tiers.filter((t:any) => t.colorCount === selectedColor);
     }
     const sizes = Array.from(new Set(tiers.map((t:any) => t.cutSize).filter((c:any) => c != null))).sort();
     const options = sizes.map(s => ({ value: s, text: s }));

     this.cutSizeOptionsCache[cacheKey] = options;
     return options;
  }

  // Core Actions
  save() {
    this.util.markFormGroupTouched(this.quotationDataSource.form);

    if (this.quotationDataSource.form.invalid) {
      this.ms.warning('Please fill in all required fields correctly.');
      // Expand parts that might have errors for better UX
      return;
    }

    this.saving = true;
    this.quotationDataSource.updateValue();

    // Map nested arrays back correctly due to FormArray complex mapping
    this.quotation.boxes = this.boxesArray.value.map((boxVal: any) => {
       return {
         boxName: boxVal.boxName,
         orderQuantities: boxVal.quantities,
         parts: boxVal.parts
       };
    });

    setTimeout(() => {
        this.saving = false;
        this.ms.success('บันทึกโครงสร้างการคำนวณ (Nested Level) เรียบร้อยแล้ว');
    }, 500);
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
      customerCode: null
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.quotationDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }
}
