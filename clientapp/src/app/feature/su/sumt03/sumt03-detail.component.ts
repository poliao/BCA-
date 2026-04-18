import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Observable, of, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ProductionProcess, ProcessPricingTier } from './sumt03.model';
import { Sumt03Service } from './sumt03.service';
import { RowState } from '@app/shared/constants';

interface PrintConditionGroup {
  form: FormGroup;
  tiers: FormDatasource<ProcessPricingTier>[];
  dataSource: MatTableDataSource<FormDatasource<ProcessPricingTier>>;
  isDelete?: boolean;
  isAdd?: boolean;
}

@Component({
  selector: 'app-sumt03-detail',
  templateUrl: './sumt03-detail.component.html'
})
export class Sumt03DetailComponent extends SubscriptionDisposer implements OnInit {
  master = { processGroups: [], productionLocations: [] };
  process: ProductionProcess = new ProductionProcess();

  processDataSource!: FormDatasource<ProductionProcess>;

  // Standard (Non-Print) Pricing Tiers
  pricingTierDataSources: FormDatasource<ProcessPricingTier>[] = [];
  pricingTiersDataSource = new MatTableDataSource<FormDatasource<ProcessPricingTier>>();

  // Print Condition Pricing Tiers
  printConditionGroups: PrintConditionGroup[] = [];

  saving = false;
  actions: any;
  displayedColumns: string[] = ['minQty', 'maxQty', 'totalAdditionalCost', 'fixedCost', 'variableRate', 'variableUnitLabel', 'locationId', 'action'];

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
      this.process = data.sumt03.detail;
      this.actions = data.sumt03.actions;
      this.master.processGroups = data.sumt03.master.processGroups;
      this.master.productionLocations = data.sumt03.master.productionLocations;
      this.rebuildForm();
    });
  }

  get isGroupedLayout(): boolean {
    if (!this.processDataSource || !this.processDataSource.form) return false;
    const groupId = this.processDataSource.form.get('groupId')?.value;
    if (!groupId) return false;
    const group: any = this.master.processGroups.find((g: any) => g.id === groupId);
    return group && (group.groupName === 'พิมพ์' || group.groupName === 'เพลท' || group.groupName === 'บล็อคปั้ม');
  }

  get isStampGroup(): boolean {
    if (!this.processDataSource || !this.processDataSource.form) return false;
    const groupId = this.processDataSource.form.get('groupId')?.value;
    const group: any = this.master.processGroups.find((g: any) => g.id === groupId);
    return group && group.groupName === 'บล็อคปั้ม';
  }

  get currentGroupName(): string {
    if (!this.processDataSource || !this.processDataSource.form) return '';
    const groupId = this.processDataSource.form.get('groupId')?.value;
    const group: any = this.master.processGroups.find((g: any) => g.id === groupId);
    return group ? group.groupName : '';
  }

  createProcessForm() {
    return this.fb.group({
      processName: [null, [Validators.required, Validators.maxLength(255)]],
      baseUom: [null, [Validators.maxLength(50)]],
      groupId: [null, [Validators.required]],
      status: ['ACTIVE', [Validators.required]]
    });
  }

  createPricingTierForm() {
    return this.fb.group({
      minQty: [null, [Validators.required]],
      maxQty: [null],
      totalAdditionalCost: [0, [Validators.required]],
      fixedCost: [0, [Validators.required]],
      variableRate: [0, [Validators.required]],
      variableUnitLabel: [null, [Validators.maxLength(50)]],
      locationId: [null]
    });
  }

  createConditionForm(colorCount: number | null, cutSize: string | null, locationId: number | null, stampType: string | null = null, stampSize: string | null = null) {
    const fg = this.fb.group({
      colorCount: [colorCount],
      cutSize: [cutSize, [Validators.maxLength(50)]],
      stampType: [stampType, [Validators.maxLength(50)]],
      stampSize: [stampSize, [Validators.maxLength(50)]],
      locationId: [locationId]
    });

    // Dynamic validators based on group type
    if (this.isStampGroup) {
      fg.get('stampType')?.setValidators([Validators.required]);
    } else {
      fg.get('colorCount')?.setValidators([Validators.required]);
      fg.get('cutSize')?.setValidators([Validators.required]);
    }
    fg.get('locationId')?.setValidators([Validators.required]);

    return fg;
  }

  rebuildForm() {
    this.processDataSource = new FormDatasource<ProductionProcess>(this.process, this.createProcessForm());

    this.pricingTierDataSources = [];
    this.printConditionGroups = [];

    if (this.process.pricingTiers && this.process.pricingTiers.length > 0) {
      if (this.isGroupedLayout) {
        // Build condition groups
        const map = new Map<string, ProcessPricingTier[]>();
        this.process.pricingTiers.forEach(tier => {
          let key = '';
          if (this.isStampGroup) {
            key = `${tier.stampType || ''}|${tier.stampSize || ''}|${tier.locationId || 0}`;
          } else {
            key = `${tier.colorCount || 0}|${tier.cutSize || ''}|${tier.locationId || 0}`;
          }
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(tier);
        });

        Array.from(map.values()).forEach(tiers => {
          const first = tiers[0];
          const condGroup: PrintConditionGroup = {
            form: this.createConditionForm(
              first.colorCount || null,
              first.cutSize || null,
              first.locationId || null,
              first.stampType || null,
              first.stampSize || null
            ),
            tiers: tiers.map(t => new FormDatasource<ProcessPricingTier>(t, this.createPricingTierForm())),
            dataSource: new MatTableDataSource<FormDatasource<ProcessPricingTier>>()
          };
          condGroup.dataSource.data = condGroup.tiers.filter(ds => !ds.isDelete);
          this.printConditionGroups.push(condGroup);
        });
      } else {
        // Standard tiers
        this.process.pricingTiers.forEach(tier => {
          this.pricingTierDataSources.push(new FormDatasource<ProcessPricingTier>(tier, this.createPricingTierForm()));
        });
      }
    }

    this.pricingTiersDataSource.data = this.activePricingTiers;
  }

  // --- Standard Tiers Methods ---

  addTier() {
    const tier = new ProcessPricingTier();
    tier.rowState = RowState.Add;
    const dataSource = new FormDatasource<ProcessPricingTier>(tier, this.createPricingTierForm());
    this.pricingTierDataSources.push(dataSource);
    this.pricingTiersDataSource.data = this.activePricingTiers;
  }

  removeTier(dataSource: FormDatasource<ProcessPricingTier>) {
    this.modal.confirm('message.STD00003').subscribe(res => {
      if (res) {
        if (dataSource.isAdd) {
          const actualIndex = this.pricingTierDataSources.indexOf(dataSource);
          this.pricingTierDataSources.splice(actualIndex, 1);
        } else {
          dataSource.markForDelete();
        }
        this.pricingTiersDataSource.data = this.activePricingTiers;
      }
    });
  }

  get activePricingTiers() {
    return this.pricingTierDataSources.filter(ds => !ds.isDelete);
  }


  get activePrintConditionGroups() {
    return this.printConditionGroups.filter(g => !g.isDelete);
  }

  addPrintCondition() {
    const condGroup: PrintConditionGroup = {
      form: this.createConditionForm(null, null, null),
      tiers: [],
      dataSource: new MatTableDataSource<FormDatasource<ProcessPricingTier>>(),
      isAdd: true
    };

    // Auto-add first empty tier
    const tier = new ProcessPricingTier();
    tier.rowState = RowState.Add;
    const dataSource = new FormDatasource<ProcessPricingTier>(tier, this.createPricingTierForm());
    condGroup.tiers.push(dataSource);
    condGroup.dataSource.data = condGroup.tiers;

    this.printConditionGroups.push(condGroup);
  }

  removePrintCondition(condGroup: PrintConditionGroup) {
    this.modal.confirm('message.STD00003').subscribe(res => {
      if (res) {
        if (condGroup.isAdd) {
          const index = this.printConditionGroups.indexOf(condGroup);
          this.printConditionGroups.splice(index, 1);
        } else {
          condGroup.isDelete = true;
          // Mark all underlying tiers as deleted
          condGroup.tiers.forEach(ds => ds.markForDelete());
        }
      }
    });
  }

  addTierToCondition(condGroup: PrintConditionGroup) {
    const tier = new ProcessPricingTier();
    tier.rowState = RowState.Add;
    const dataSource = new FormDatasource<ProcessPricingTier>(tier, this.createPricingTierForm());
    condGroup.tiers.push(dataSource);
    condGroup.dataSource.data = condGroup.tiers.filter(ds => !ds.isDelete);
  }

  removeTierFromCondition(condGroup: PrintConditionGroup, dataSource: FormDatasource<ProcessPricingTier>) {
    this.modal.confirm('message.STD00003').subscribe(res => {
      if (res) {
        if (dataSource.isAdd) {
          const index = condGroup.tiers.indexOf(dataSource);
          condGroup.tiers.splice(index, 1);
        } else {
          dataSource.markForDelete();
        }
        condGroup.dataSource.data = condGroup.tiers.filter(ds => !ds.isDelete);
      }
    });
  }

  // --- Save / Validate ---

  save() {
    this.util.markFormGroupTouched(this.processDataSource.form);
    if (this.processDataSource.form.invalid) return;

    let hasInvalidTiers = false;

    if (this.isGroupedLayout) {
      // Validate print condition groups
      this.printConditionGroups.forEach(cond => {
        if (cond.isDelete) return;
        this.util.markFormGroupTouched(cond.form);
        if (cond.form.invalid) hasInvalidTiers = true;

        cond.tiers.forEach(ds => {
          if (!ds.isDelete) {
            this.util.markFormGroupTouched(ds.form);
            if (ds.form.invalid) hasInvalidTiers = true;
          }
        });

        if (cond.tiers.filter(ds => !ds.isDelete).length === 0) {
          this.ms.warning('ต้องมีข้อมูลระดับราคาอย่างน้อย 1 รายการ'); // At least 1 tier required
          hasInvalidTiers = true;
        }
      });
    } else {
      // Validate standard tiers
      if (this.pricingTierDataSources.some(ds => ds.form.invalid && !ds.isDelete)) {
        this.pricingTierDataSources.forEach(ds => {
          if (!ds.isDelete) this.util.markFormGroupTouched(ds.form);
        });
        hasInvalidTiers = true;
      }
    }

    if (hasInvalidTiers) {
      this.ms.warning('message.STD00027');
      return;
    }

    this.processDataSource.updateValue();

    let allFinalTiers: ProcessPricingTier[] = [];

    if (this.isGroupedLayout) {
      // Collect from condition groups
      this.printConditionGroups.forEach(cond => {
        const { colorCount, cutSize, locationId, stampType, stampSize } = cond.form.getRawValue();
        cond.tiers.forEach(ds => {
          ds.updateValue();
          ds.model.colorCount = colorCount;
          ds.model.cutSize = cutSize;
          ds.model.stampType = stampType;
          ds.model.stampSize = stampSize;
          ds.model.locationId = locationId;
          allFinalTiers.push(ds.model);
        });
      });
    } else {
      // Collect from standard tiers
      this.pricingTierDataSources.forEach(ds => {
        ds.updateValue();
        ds.model.colorCount = undefined;
        ds.model.cutSize = undefined;
        allFinalTiers.push(ds.model);
      });
    }

    this.process.pricingTiers = allFinalTiers;

    this.saving = true;
    this.su.save(this.process).pipe(
      switchMap((res: any) => this.su.getProcess(res.id))
    ).subscribe({
      next: (process) => {
        this.process = process;
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
    const isProcessDirty = this.processDataSource.form.dirty;
    const isStandardDirty = this.pricingTierDataSources.some(ds => ds.form.dirty);
    const isPrintDirty = this.printConditionGroups.some(cond =>
      cond.form.dirty || cond.tiers.some(ds => ds.form.dirty)
    );

    if (isProcessDirty || (!this.isGroupedLayout && isStandardDirty) || (this.isGroupedLayout && isPrintDirty)) {
      return this.modal.confirm("message.STD00002");
    }
    return of(true);
  }
}

