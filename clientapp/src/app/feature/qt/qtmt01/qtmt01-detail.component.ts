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
  private readonly EMPTY_ARRAY: any[] = [];

  // Master Data
  masterProcesses: any[] = [];
  paperOptions: any[] = [];
  productionLocations: any[] = [];
  printProcesses: any[] = [];
  coatingProcesses: any[] = [];
  stampProcesses: any[] = [];      // บล็อคปั้ม (block-level)
  stampItemProcesses: any[] = []; // ประเภทการปั้ม (item-level)
  gluingProcesses: any[] = [];    // งานปะ

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
    { value: 'ปั้มไดคัท',    text: 'ปั้มไดคัท (Die-cutting)' },
    { value: 'ปั้มนูน',      text: 'ปั้มนูน (Embossing)' },
    { value: 'ปั้มจม',       text: 'ปั้มจม (Debossing)' },
    { value: 'ปั้มเคเงิน',  text: 'ปั้มเคเงิน (Silver Foil)' },
    { value: 'ปั้มเคทอง',   text: 'ปั้มเคทอง (Gold Foil)' },
    { value: 'ปั้มไมโครดอท', text: 'ปั้มไมโครดอท (Microdot)' }
  ];

  vatOptions = [
    { value: 'VAT 7%', text: 'VAT 7%' },
    { value: 'VAT 0%', text: 'VAT 0%' },
    { value: 'NON VAT', text: 'NON VAT' },
    { value: 'CUSTOM',  text: 'กำหนดเอง (Custom)' }
  ];

  vatIncludedOptions = [
    { value: true, text: 'รวม VAT' },
    { value: false, text: 'ไม่รวม VAT' }
  ];

  rdKeyword = '';
  searchingRD = false;
  calculationResults: any[] = [];
  selectedQtyIndex: number = 0;

  get formValue() {
    return this.quotationDataSource?.form?.getRawValue();
  }

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

  getStampEntriesArray(boxIndex: number, partIndex: number): FormArray {
    return this.getPartsArray(boxIndex).at(partIndex).get('stampEntries') as FormArray;
  }

  getStampItemsArray(boxIndex: number, partIndex: number, entryIndex: number): FormArray {
    return this.getStampEntriesArray(boxIndex, partIndex).at(entryIndex).get('items') as FormArray;
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
      const rawPapers = data.qtmt01.master?.papers || [];

      // Combine groupName into process
      this.masterProcesses = rawProcesses.map((p:any) => {
          const g = groups.find((grp:any) => grp.id === p.groupId);
          return { ...p, _groupName: g ? g.groupName : '' };
      });

      this.productionLocations = data.qtmt01.master?.locations || [];

      this.paperOptions = rawPapers.map((p:any) => ({
          ...p,
          _displayName: '[' + p.itemCode + '] ' + p.itemNameTh
      }));
      this.printProcesses = this.masterProcesses.filter((p:any) => p._groupName.includes('พิมพ์'));
      this.coatingProcesses = this.masterProcesses.filter((p:any) =>
        p._groupName.includes('เคลือบ') || p._groupName.toLowerCase().includes('coat')
      );
      this.stampProcesses = this.masterProcesses.filter((p:any) =>
        p._groupName === 'บล็อคปั้ม'
      );
      this.stampItemProcesses = this.masterProcesses.filter((p:any) =>
        p._groupName.includes('ปั้ม') && p._groupName !== 'บล็อคปั้ม'
      );
      this.gluingProcesses = this.masterProcesses.filter((p:any) =>
        p._groupName.includes('ปะ')
      );

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
      remarkInternal: [null],
      vatType: ['VAT 7%'],
      isVatIncluded: [false],
      vatRate: [7],
      deliveryCost: [0],
      operatingCost: [0],
      profitMarginPercent: [60],

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
      productionLocationId: [part.productionLocationId || null, [Validators.required]],
      paperId: [part.paperId || null, [Validators.required]],
      paperSizeId: [part.paperSizeId || null, [Validators.required]],
      paperGramId: [part.paperGramId || null, [Validators.required]],
      
      // Layout Configs
      isCutBasePaper: [part.isCutBasePaper || false],
      paperCutPieces: [part.paperCutPieces || null],
      paperCutWidth: [part.paperCutWidth || null],
      paperCutLength: [part.paperCutLength || null],
      
      layQty: [part.layQty || null, [Validators.required, Validators.min(1)]],
      layHorizontal: [part.layHorizontal || null],
      layVertical: [part.layVertical || null],
      wastageSheets: [part.wastageSheets || 0],
      
      printProcessId: [part.printProcessId || null, [Validators.required]],
      printStyle: [part.printStyle || 'หน้าเดียว', [Validators.required]],
      printColorFront: [part.printColorFront || null],
      printColorBack: [part.printColorBack || null],
      printCutSizeFront: [part.printCutSizeFront || null],
      printCutSizeBack: [part.printCutSizeBack || null],
      coatingType: [part.coatingType || null],
      coatings: this.fb.array(
        (part.coatings || []).map((c:any) => this.createCoatingGroup(c))
      ),
      stampEntries: this.fb.array(
        (part.stampEntries || []).map((e:any) => this.createStampEntryGroup(e))
      ),
      gluings: this.fb.array(
        (part.gluings || []).map((g:any) => this.createGluingGroup(g))
      )
    });

    fg.get('paperId')?.valueChanges.subscribe(val => {
       fg.get('paperSizeId')?.patchValue(null, { emitEvent: false });
       fg.get('paperGramId')?.patchValue(null, { emitEvent: false });
    });

    fg.get('paperSizeId')?.valueChanges.subscribe(val => {
       fg.get('paperGramId')?.patchValue(null, { emitEvent: false });
    });

    // Layout configuration rules
    fg.get('isCutBasePaper')?.valueChanges.subscribe(isCut => {
        const pCutPieces = fg.get('paperCutPieces');
        const pCutW = fg.get('paperCutWidth');
        const pCutL = fg.get('paperCutLength');
        
        if (isCut) {
            pCutPieces?.setValidators([Validators.required, Validators.min(2)]);
            pCutW?.setValidators([Validators.required, Validators.min(0.1)]);
            pCutL?.setValidators([Validators.required, Validators.min(0.1)]);
        } else {
            pCutPieces?.clearValidators();
            pCutW?.clearValidators();
            pCutL?.clearValidators();
            
            pCutPieces?.patchValue(null);
            pCutW?.patchValue(null);
            pCutL?.patchValue(null);
        }
        
        pCutPieces?.updateValueAndValidity();
        pCutW?.updateValueAndValidity();
        pCutL?.updateValueAndValidity();
    });

    // Auto calculate layQty based on Horizontal x Vertical
    const calcLayQty = () => {
        const h = fg.get('layHorizontal')?.value || 0;
        const v = fg.get('layVertical')?.value || 0;
        if (h > 0 && v > 0) {
            fg.get('layQty')?.patchValue(h * v);
        }
    };

    fg.get('layHorizontal')?.valueChanges.subscribe(calcLayQty);
    fg.get('layVertical')?.valueChanges.subscribe(calcLayQty);

    // Cascading Resets
    fg.get('printProcessId')?.valueChanges.subscribe(() => {
      fg.get('productionLocationId')?.patchValue(null, { emitEvent: false });
      fg.get('printColorFront')?.patchValue(null, { emitEvent: false });
      fg.get('printColorBack')?.patchValue(null, { emitEvent: false });
      fg.get('printCutSizeFront')?.patchValue(null, { emitEvent: false });
      fg.get('printCutSizeBack')?.patchValue(null, { emitEvent: false });
      this.locationOptionsCache = {};
      this.colorOptionsCache = {};
      this.cutSizeOptionsCache = {};
    });

    fg.get('productionLocationId')?.valueChanges.subscribe(() => {
      fg.get('printColorFront')?.patchValue(null, { emitEvent: false });
      fg.get('printColorBack')?.patchValue(null, { emitEvent: false });
      fg.get('printCutSizeFront')?.patchValue(null, { emitEvent: false });
      fg.get('printCutSizeBack')?.patchValue(null, { emitEvent: false });
      this.colorOptionsCache = {};
      this.cutSizeOptionsCache = {};
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

    return fg;
  }

  // Stable per-entry stamp size options map (keyed by FormGroup reference)
  stampSizeOptionsMap = new Map<FormGroup, any[]>();

  createStampEntryGroup(entry?: any): FormGroup {
    const fg = this.fb.group({
      id: [entry?.id || null],
      stampProcessId: [entry?.stampProcessId || null, Validators.required],
      stampSizeSelected: [entry?.stampSizeSelected || null, Validators.required],
      batchNote: [entry?.batchNote || null],
      items: this.fb.array(
        (entry?.items || []).map((item: any) => this.createStampItemGroup(item))
      )
    });

    // Initialise size options for existing process
    const initId = entry?.stampProcessId;
    if (initId) {
      this.stampSizeOptionsMap.set(fg, this.buildStampSizeOptions(initId));
    } else {
      this.stampSizeOptionsMap.set(fg, this.EMPTY_ARRAY);
    }

    // Cascade: when process changes → reset size & refresh options
    fg.get('stampProcessId')?.valueChanges.subscribe((processId: number) => {
      fg.get('stampSizeSelected')?.patchValue(null, { emitEvent: false });
      this.stampSizeOptionsMap.set(fg, processId ? this.buildStampSizeOptions(processId) : this.EMPTY_ARRAY);
    });

    return fg;
  }

  createStampItemGroup(item?: any): FormGroup {
    return this.fb.group({
      id: [item?.id || null],
      stampItemProcessId: [item?.stampItemProcessId || null, Validators.required],
      width: [item?.width || null, [Validators.required, Validators.min(0.1)]],
      length: [item?.length || null, [Validators.required, Validators.min(0.1)]],
      stampNote: [item?.stampNote || null]
    });
  }

  setupVatListener() {
    const vatTypeCtrl = this.quotationDataSource.form.get('vatType');
    const vatRateCtrl = this.quotationDataSource.form.get('vatRate');

    vatTypeCtrl?.valueChanges.subscribe(val => {
      if (val === 'VAT 7%') {
        vatRateCtrl?.patchValue(7);
      } else if (val === 'VAT 0%' || val === 'NON VAT') {
        vatRateCtrl?.patchValue(0);
      }
      // If CUSTOM, leave what it is or let user edit
    });
  }

  setupCalculationListener() {
    this.quotationDataSource.form.valueChanges.subscribe(() => {
      this.calculateQuotation();
    });
  }

  calculateQuotation() {
    const formValue = this.quotationDataSource.form.getRawValue();
    const margin = formValue.profitMarginPercent || 60;
    
    // Cache old overrides before regenerating
    const oldOverrides: { [key: string]: any } = {};
    if (this.calculationResults && this.calculationResults.length > 0) {
      this.calculationResults.forEach((r: any, bIdx: number) => {
        r.sheets?.forEach((s: any, qIdx: number) => {
          s.groups?.forEach((g: any, gIdx: number) => {
            g.items?.forEach((itm: any, iIdx: number) => {
              const key = `${bIdx}_${qIdx}_${gIdx}_${iIdx}`;
              oldOverrides[key] = {
                adjRate: itm.adjRate,
                adjTotal: itm.adjTotal,
                isTotalOverride: itm.isTotalOverride,
                margin: itm.margin
              };
            });
          });
        });
      });
    }

    const boxWorksheets: any[] = [];
    let totalGrandCost = 0;
    let totalProfit = 0;
    let grandTotal = 0;

    formValue.boxes?.forEach((box: any, bIndex: number) => {
      const boxWorksheet: any = {
        boxName: box.boxName || `กล่องที่ ${bIndex + 1}`,
        quantities: box.quantities || [],
        sheets: []
      };

      box.quantities?.forEach((qty: number, qIndex: number) => {
        const groups: any[] = [
          { groupName: 'ออกแบบ', items: [] },
          { groupName: 'กระดาษ', items: [] },
          { groupName: 'พิมพ์', items: [] },
          { groupName: 'หลังพิมพ์', items: [] }
        ];

        // Group 0: Operating Cost
        if (formValue.operatingCost > 0) {
          groups[0].items.push({ label: 'ค่าดำเนินการส่วนกลาง', qty: 1,
            baseRate: formValue.operatingCost, adjRate: 0,
            adjTotal: 0, costTotal: formValue.operatingCost, margin });
        }

        box.parts?.forEach((part: any) => {

          // Item #1: กระดาษ
          const paper = this.paperOptions.find((p: any) => p.id === part.paperId);
          const size = paper?.sizes?.find((s: any) => s.id === part.paperSizeId);
          const gramObj = size?.grams?.find((g: any) => g.id === part.paperGramId);
          if (paper && size && gramObj) {
            const layQty = part.layQty || 1;
            const totalSheets = Math.ceil(qty / layQty) + (part.wastageSheets || 0);
            const weightKg = (size.width * size.length * gramObj.gram * totalSheets) / 1550000;
            const paperCost = weightKg * (gramObj.purchasePrice || 0);
            const ratePerSheet = totalSheets > 0 ? paperCost / totalSheets : 0;
            groups[1].items.push({
              label: `${paper._displayName || paper.itemNameTh} (${size.width}"×${size.length}")`,
              qty: totalSheets, baseRate: ratePerSheet, adjRate: 0,
              costTotal: paperCost, adjTotal: 0, margin, note: `${weightKg.toFixed(3)} กก. | ${gramObj.gram} แกรม`
            });
          }

          // Item #2: เพลท & Item #3: พิมพ์
          const printProc = this.printProcesses.find((p: any) => p.id === part.printProcessId);
          if (printProc?.pricingTiers) {
            const frontColors = part.printColorFront || 0;
            const backColors = part.printColorBack || 0;
            const colorCount = frontColors + backColors;
            const tier = printProc.pricingTiers.find((t: any) =>
              t.locationId === part.productionLocationId && t.colorCount === colorCount
            );
            if (tier) {
              // Plate Cost
              const plateCost = colorCount * (tier.platePrice || 500);
              groups[2].items.push({
                label: `ค่าเพลท (${colorCount} สี)`, qty: colorCount,
                baseRate: tier.platePrice || 500, adjRate: 0,
                costTotal: plateCost, adjTotal: 0, margin
              });
              // Print Cost
              const layQty = part.layQty || 1;
              const printSheets = Math.ceil(qty / layQty) + (part.wastageSheets || 0);
              const printRate = tier.price || 0.5;
              groups[2].items.push({
                label: `ค่าพิมพ์ ${printProc.processName}`, qty: printSheets,
                baseRate: printRate, adjRate: 0, costTotal: printSheets * printRate,
                adjTotal: 0, margin, note: part.printStyle !== 'หน้าเดียว' ? part.printStyle : null
              });
              // Item #3 Extra: Setup cost for double-sided printing
              if (part.printStyle === 'กลับนอก' || part.printStyle === 'กลับในตัว') {
                const setupCost = tier.setupPrice || 500;
                groups[2].items.push({
                  label: `ค่าตั้งเครื่อง (${part.printStyle})`, qty: 1,
                  baseRate: setupCost, adjRate: 0, costTotal: setupCost, adjTotal: 0, margin
                });
              }
            }
          }

          // Item #4: เคลือบ
          part.coatings?.forEach((c: any) => c.items?.forEach((ci: any) => {
            const proc = this.coatingProcesses.find((p: any) => p.id === ci.coatingProcessId);
            const tier = proc?.pricingTiers?.[0];
            if (tier) {
              const layQty = part.layQty || 1;
              const cSheets = Math.ceil(qty / layQty) + (part.wastageSheets || 0);
              const coatRate = tier.price || 0.3;
              groups[3].items.push({
                label: `ค่าเคลือบ ${proc.processName}`, qty: cSheets,
                baseRate: coatRate, adjRate: 0, costTotal: cSheets * coatRate, adjTotal: 0, margin
              });
            }
          }));

          // Item #5-10: บล็อก + ปั๊ม
          part.stampEntries?.forEach((entry: any) => {
            const proc = this.stampProcesses.find((p: any) => p.id === entry.stampProcessId);
            const tier = proc?.pricingTiers?.find((t: any) => t.stampSize === entry.stampSizeSelected);
            if (tier) {
              entry.items?.forEach((si: any) => {
                const blockCost = (si.width * si.length) * (tier.price || 5);
                groups[3].items.push({
                  label: `ค่าบล็อก (${proc.processName} ${entry.stampSizeSelected})`, qty: 1,
                  baseRate: blockCost, adjRate: 0, costTotal: blockCost, adjTotal: 0, margin
                });
                const stampRate = tier.additionalPrice || 0.1;
                groups[3].items.push({
                  label: `ค่าปั๊ม (${entry.stampSizeSelected})`, qty: qty,
                  baseRate: stampRate, adjRate: 0, costTotal: qty * stampRate, adjTotal: 0, margin
                });
              });
            }
          });

          // Item #11: ประกบลูกฟูก (Removed for now, handled via SUMT03 standard later)

          // Item #12-13: ปะกาว
          part.gluings?.forEach((g: any) => {
            const proc = this.gluingProcesses.find((p: any) => p.id === g.gluingProcessId);
            if (proc) {
              const gluingRate = proc.pricingTiers?.[0]?.price || 0.1;
              groups[3].items.push({
                label: `ค่าปะกาว ${proc.processName}`, qty: qty,
                baseRate: gluingRate, adjRate: 0, costTotal: qty * gluingRate, adjTotal: 0, margin
              });
            }
          });
        });

        // Item #14: ค่าจัดส่ง
        if (formValue.deliveryCost > 0) {
          groups[3].items.push({
            label: 'ค่าจัดส่ง', qty: 1, baseRate: formValue.deliveryCost,
            adjRate: 0, costTotal: formValue.deliveryCost, adjTotal: 0, margin
          });
        }

        // Calculate totals per sheet
        let sheetTotalCost = 0;
        let sheetTotalPrice = 0;
        groups.forEach((g, gIdx) => {
          g.items.forEach((item: any, iIdx) => {
            const key = `${bIndex}_${qIndex}_${gIdx}_${iIdx}`;
            if (oldOverrides[key]) {
              item.adjRate = oldOverrides[key].adjRate || 0;
              item.adjTotal = oldOverrides[key].adjTotal || 0;
              item.isTotalOverride = oldOverrides[key].isTotalOverride || false;
              item.margin = oldOverrides[key].margin !== undefined ? oldOverrides[key].margin : item.margin;
            }

            const effectiveTotal = item.isTotalOverride ? item.adjTotal : (item.costTotal || 0) + ((item.adjRate || 0) * item.qty || 0);
            item.finalTotal = effectiveTotal;
            sheetTotalCost += effectiveTotal;
            item.finalPrice = effectiveTotal * (1 + ((item.margin || 0) / 100));
            sheetTotalPrice += item.finalPrice;
          });
        });

        boxWorksheet.sheets.push({ groups, totalCost: sheetTotalCost, totalPrice: sheetTotalPrice, qty });

        if (qIndex === this.selectedQtyIndex) {
          totalGrandCost += sheetTotalCost;
          totalProfit += (sheetTotalPrice - sheetTotalCost);
          grandTotal += sheetTotalPrice;
        }
      });
      boxWorksheets.push(boxWorksheet);
    });

    this.calculationResults = boxWorksheets;

    const vatRate = formValue.vatRate || 0;
    const vatAmount = grandTotal * (vatRate / 100);
    const grandTotalWithVat = grandTotal + (formValue.isVatIncluded ? 0 : vatAmount);

    this.quotationDataSource.form.get('totalCost')?.patchValue(totalGrandCost, { emitEvent: false });
    this.quotationDataSource.form.get('profitAmount')?.patchValue(totalProfit, { emitEvent: false });
    this.quotationDataSource.form.get('vatAmount')?.patchValue(vatAmount, { emitEvent: false });
    this.quotationDataSource.form.get('totalAmount')?.patchValue(grandTotal, { emitEvent: false });
    this.quotationDataSource.form.get('grandTotal')?.patchValue(grandTotalWithVat, { emitEvent: false });
  }

  rebuildForm() {
    this.quotationDataSource = new FormDatasource<Qtmt01>(this.quotation, this.createForm());
    this.setupVatListener();
    this.setupCalculationListener();
    this.calculateQuotation();
  }

  onQtyChange(index: number) {
    this.selectedQtyIndex = index;
    this.calculateQuotation();
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

  addStampEntry(boxIndex: number, partIndex: number) {
    this.getStampEntriesArray(boxIndex, partIndex).push(this.createStampEntryGroup());
  }

  removeStampEntry(boxIndex: number, partIndex: number, entryIndex: number) {
    this.getStampEntriesArray(boxIndex, partIndex).removeAt(entryIndex);
  }

  addStampItem(boxIndex: number, partIndex: number, entryIndex: number) {
    this.getStampItemsArray(boxIndex, partIndex, entryIndex).push(this.createStampItemGroup());
  }

  removeStampItem(boxIndex: number, partIndex: number, entryIndex: number, itemIndex: number) {
    this.getStampItemsArray(boxIndex, partIndex, entryIndex).removeAt(itemIndex);
  }

  // Dynamic Options Caches
  locationOptionsCache: { [processId: number]: any[] } = {};
  colorOptionsCache: { [processId: number]: any[] } = {};
  cutSizeOptionsCache: { [key: string]: any[] } = {};
  paperSizeOptionsCache: { [key: string]: any[] } = {};
  paperGramOptionsCache: { [key: string]: any[] } = {};

  getPaperSizeOptions(boxIndex: number, partIndex: number): any[] {
     const fg = this.getPartsArray(boxIndex).at(partIndex);
     const part = fg.value;
     if (!part.paperId) return this.EMPTY_ARRAY;

     const cacheKey = part.paperId.toString();
     if (this.paperSizeOptionsCache[cacheKey]) {
         return this.paperSizeOptionsCache[cacheKey];
     }

     const paper = this.paperOptions.find((p:any) => p.id === part.paperId);
     if (!paper || !paper.sizes) return this.EMPTY_ARRAY;
     const options = paper.sizes.map((s:any) => ({
         id: s.id,
         _displayName: `${s.width} x ${s.length} ${paper.unit || 'นิ้ว'}`
     }));

     this.paperSizeOptionsCache[cacheKey] = options;
     return options;
  }

  getPaperGramOptions(boxIndex: number, partIndex: number): any[] {
     const fg = this.getPartsArray(boxIndex).at(partIndex);
     const part = fg.value;
     if (!part.paperId || !part.paperSizeId) return this.EMPTY_ARRAY;

     const cacheKey = `${part.paperId}_${part.paperSizeId}`;
     if (this.paperGramOptionsCache[cacheKey]) {
         return this.paperGramOptionsCache[cacheKey];
     }

     const paper = this.paperOptions.find((p:any) => p.id === part.paperId);
     if (!paper || !paper.sizes) return this.EMPTY_ARRAY;
     const size = paper.sizes.find((s:any) => s.id === part.paperSizeId);
     if (!size || !size.grams) return this.EMPTY_ARRAY;
     
     const options = size.grams.map((g:any) => ({
         id: g.id,
         _displayName: `${g.gram} แกรม (฿${g.purchasePrice})`
     }));

     this.paperGramOptionsCache[cacheKey] = options;
     return options;
  }

  getCoatingsArray(boxIndex: number, partIndex: number): FormArray {
    return this.getPartsArray(boxIndex).at(partIndex).get('coatings') as FormArray;
  }

  createCoatingGroup(c: any = {}): FormGroup {
    return this.fb.group({
      id: [c.id || null],
      isCutBeforeCoating: [c.isCutBeforeCoating || false],
      coatingCutPieces: [c.coatingCutPieces || null],
      coatingCutWidth: [c.coatingCutWidth || null],
      coatingCutLength: [c.coatingCutLength || null],
      items: this.fb.array(
        (c.items || []).map((item: any) => this.createCoatingItemGroup(item))
      )
    });
  }

  createCoatingItemGroup(item: any = {}): FormGroup {
    return this.fb.group({
      id: [item.id || null],
      coatingProcessId: [item.coatingProcessId || null, [Validators.required]],
      coatingNote: [item.coatingNote || null]
    });
  }

  getCoatingItemsArray(boxIndex: number, partIndex: number, coatingIndex: number): FormArray {
    return this.getCoatingsArray(boxIndex, partIndex).at(coatingIndex).get('items') as FormArray;
  }

  addCoatingItem(boxIndex: number, partIndex: number, coatingIndex: number) {
    this.getCoatingItemsArray(boxIndex, partIndex, coatingIndex).push(this.createCoatingItemGroup());
  }

  removeCoatingItem(boxIndex: number, partIndex: number, coatingIndex: number, itemIndex: number) {
    this.getCoatingItemsArray(boxIndex, partIndex, coatingIndex).removeAt(itemIndex);
  }

  addCoating(boxIndex: number, partIndex: number) {
    this.getCoatingsArray(boxIndex, partIndex).push(this.createCoatingGroup());
  }

  removeCoating(boxIndex: number, partIndex: number, coatingIndex: number) {
    this.getCoatingsArray(boxIndex, partIndex).removeAt(coatingIndex);
  }

  // Gluing Handlers
  getGluingsArray(boxIndex: number, partIndex: number): FormArray {
    return this.getPartsArray(boxIndex).at(partIndex).get('gluings') as FormArray;
  }

  createGluingGroup(g: any = {}): FormGroup {
    return this.fb.group({
      id: [g.id || null],
      gluingProcessId: [g.gluingProcessId || null, [Validators.required]],
      gluingNote: [g.gluingNote || null]
    });
  }

  addGluing(boxIndex: number, partIndex: number) {
    this.getGluingsArray(boxIndex, partIndex).push(this.createGluingGroup());
  }

  removeGluing(boxIndex: number, partIndex: number, gIndex: number) {
    this.getGluingsArray(boxIndex, partIndex).removeAt(gIndex);
  }

  // Dynamic Options Getters
  getPrintProcessOptions(boxIndex?: number, partIndex?: number): any[] {
     return this.printProcesses;
  }

  getLocationOptions(boxIndex: number, partIndex: number): any[] {
     const part = this.getPartsArray(boxIndex).at(partIndex).value;
     const processId = part.printProcessId;
     if (!processId) return this.EMPTY_ARRAY;

     if (this.locationOptionsCache[processId]) {
         return this.locationOptionsCache[processId];
     }

     const process = this.printProcesses.find((p:any) => p.id === processId);
     if (!process || !process.pricingTiers) return this.EMPTY_ARRAY;

     const locationIds = Array.from(new Set(process.pricingTiers.map((t:any) => t.locationId).filter((id:any) => id != null)));
     const options = this.productionLocations.filter((loc:any) => locationIds.includes(loc.id));
     
     this.locationOptionsCache[processId] = options;
     return options;
  }

  getColorOptions(boxIndex: number, partIndex: number): any[] {
     const part = this.getPartsArray(boxIndex).at(partIndex).value;
     const processId = part.printProcessId;
     const locationId = part.productionLocationId;
     if (!processId || !locationId) return this.EMPTY_ARRAY;

     const cacheKey = `${processId}|${locationId}`;
     if (this.colorOptionsCache[cacheKey]) {
         return this.colorOptionsCache[cacheKey];
     }

     const process = this.printProcesses.find((p:any) => p.id === processId);
     if (!process || !process.pricingTiers) return this.EMPTY_ARRAY;
     
     const tiers = process.pricingTiers.filter((t:any) => t.locationId === locationId);
     const colors = Array.from(new Set(tiers.map((t:any) => t.colorCount).filter((c:any) => c != null))).sort();
     const options = colors.map(c => ({ value: c, text: `${c} สี` }));
     
     this.colorOptionsCache[cacheKey] = options;
     return options;
  }

  getCutSizeOptions(boxIndex: number, partIndex: number, side: 'front'|'back'): any[] {
     const part = this.getPartsArray(boxIndex).at(partIndex).value;
     const processId = part.printProcessId;
     const locationId = part.productionLocationId;
     if (!processId || !locationId) return this.EMPTY_ARRAY;

     const selectedColor = side === 'front' ? part.printColorFront : part.printColorBack;
     const cacheKey = `${processId}|${locationId}|${selectedColor || 'any'}`;

     if (this.cutSizeOptionsCache[cacheKey]) {
         return this.cutSizeOptionsCache[cacheKey];
     }

     const process = this.printProcesses.find((p:any) => p.id === processId);
     if (!process || !process.pricingTiers) return this.EMPTY_ARRAY;
     
     let tiers = process.pricingTiers;
     if (selectedColor) {
         tiers = tiers.filter((t:any) => t.colorCount === selectedColor);
     }
     const sizes = Array.from(new Set(tiers.map((t:any) => t.cutSize).filter((c:any) => c != null))).sort();
     const options = sizes.map(s => ({ value: s, text: s }));

     this.cutSizeOptionsCache[cacheKey] = options;
     return options;
  }

  // Stamp Size Options
  stampSizeOptionsCache: { [processId: number]: any[] } = {};

  buildStampSizeOptions(processId: number): any[] {
    if (!processId) return this.EMPTY_ARRAY;
    if (this.stampSizeOptionsCache[processId]) {
      return this.stampSizeOptionsCache[processId];
    }
    const process = this.stampProcesses.find((p: any) => p.id === processId);
    if (!process || !process.pricingTiers) return this.EMPTY_ARRAY;
    const sizes = Array.from(
      new Set(
        process.pricingTiers
          .map((t: any) => t.stampSize)
          .filter((s: any) => s != null && s !== '')
      )
    ).sort() as string[];
    const options = sizes.map(s => ({ value: s, text: s }));
    this.stampSizeOptionsCache[processId] = options;
    return options;
  }

  getStampSizeOptions(entryFg: FormGroup): any[] {
    return this.stampSizeOptionsMap.get(entryFg) ?? this.EMPTY_ARRAY;
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
